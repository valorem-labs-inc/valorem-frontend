import React, { useCallback, useEffect, useMemo, useState } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";

import BlankState from "../blankState";
import Button from "../button";
import Loader from "../loader";
import OptionModal from "../optionModal";
import Vault from "../../layouts/vault";
import { OptionDetails } from "../../lib/types";
import StyledOptions from "./index.css";
import { useOptions } from "../../graphql/hooks/useOptions";
import OptionsList from "../optionsList";
import { Contract } from "ethers";
import { erc20ABI, useSigner } from "wagmi";
import getConfigValue from "../../lib/getConfigValue";

const shouldInclude = (active, checkDate: moment.Moment): boolean => {
  const now = moment();
  if (active) {
    return checkDate.isAfter(now);
  }
  return checkDate.isBefore(now);
};

function Options(): JSX.Element {
  const optionsSettlementEngineAddress = getConfigValue("contract.address");

  const [list, setList] = useState("active");
  const [optionDetail, setOptionDetail] = useState<OptionDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    query: { option: optionId = "" },
  } = useRouter();

  const { data: signer } = useSigner();

  const { options, isLoading, refetch } = useOptions();

  const visibleOptions = useMemo(() => {
    if (!isLoading && options) {
      const active = list === "active";
      return options.filter((item) =>
        shouldInclude(active, moment.unix(item.option.expiryTimestamp))
      );
    }

    return [];
  }, [list, options, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (options.length > 0 && optionId) {
        const option = options.find((o) => o.option.id === optionId);
        setOptionDetail(option || null);
        setModalOpen(!!option);
      } else {
        setModalOpen(false);
      }
    }
  }, [options, optionId, isLoading]);

  const handleOpenOptionModal = useCallback((optionData: OptionDetails) => {
    setOptionDetail(optionData);
    setModalOpen(true);
    Router.push(`/vault/options?option=${optionData.option.id}`);
  }, []);

  const handleApproveExerciseAsset = useCallback(
    async (exerciseAsset: string) => {
      const token = new Contract(exerciseAsset, erc20ABI, signer);

      const tx = await token.approve(
        optionsSettlementEngineAddress,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );

      await tx.wait();

      refetch();
    },
    [signer, optionsSettlementEngineAddress, refetch]
  );

  const pageBody = useMemo(() => {
    if (isLoading) {
      return <Loader />;
    }
    if (visibleOptions.length === 0) {
      return (
        <BlankState
          title={
            {
              active: "You aren't holding any active options.",
              expired: "You aren't holding any expired options.",
            }[list]
          }
          subtitle={
            {
              active:
                'To write a new option, click the "Write Option" button above.',
              expired:
                "Once options you've hold have expired, they will display here.",
            }[list]
          }
        />
      );
    }
    return (
      <OptionsList
        options={visibleOptions}
        onSelect={(optionDetail) => handleOpenOptionModal(optionDetail)}
        expired={list === "expired"}
      />
    );
  }, [isLoading, visibleOptions, list, handleOpenOptionModal]);

  return (
    <>
      <Vault>
        <StyledOptions>
          <header>
            <h4>Options</h4>
            <Button
              theme="purple-blue"
              onClick={() => Router.push("/vault/options/new")}
            >
              Write Options
            </Button>
          </header>
          <div className="tabs">
            <ul>
              <li
                className={list === "active" ? `active` : ""}
                onClick={() => setList("active")}
              >
                Active
              </li>
              <li
                className={list === "expired" ? `active` : ""}
                onClick={() => setList("expired")}
              >
                Expired
              </li>
            </ul>
          </div>
          {pageBody}
        </StyledOptions>
      </Vault>
      <OptionModal
        hide={true}
        canExercise={optionDetail?.canExercise}
        open={modalOpen}
        option={optionDetail?.option}
        balance={optionDetail?.balance}
        needsApproval={optionDetail?.needsApproval}
        onApprove={() => {
          handleApproveExerciseAsset(optionDetail.option.exerciseAsset);
        }}
        onClose={() => {
          setModalOpen(false);
          Router.router.push("/vault/options");
          refetch();
        }}
      />
    </>
  );
}

export default Options;
