import { BigNumber } from "ethers";
import _ from "lodash";
import moment from "moment";
import Router from "next/router";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import BlankState from "../../../components/blankState";
import Button from "../../../components/button";
import Loader from "../../../components/loader";
import OptionModal from "../../../components/optionModal";
import Vault from "../../../layouts/vault";
import { smartFormatCurrency } from "../../../lib/currencyFormat";
import { getOptionsWithDetails } from "../../../lib/getOptions";
import getToken from "../../../lib/getToken";
import { OptionDetails } from "../../../lib/types";
import StyledOptions from "./index.css";

const formatDate = (detail: OptionDetails, field: string): string => {
  const fieldName = `${field}Timestamp`;
  return moment.unix(detail.option[fieldName]).format("MMM Do, YYYY");
};

const formatAmount = (detail: OptionDetails, field: string): string => {
  const amountField = `${field}Amount`;
  const assetField = `${field}Asset`;
  const token = getToken(detail.option[assetField]).symbol;
  const amount: BigNumber = detail.option[amountField];
  const showAmount = amount.gt(0)
    ? smartFormatCurrency(amount, detail[assetField])
    : "~";
  return `${showAmount} ${token}`;
};

const shouldInclude = (active, checkDate: moment.Moment): boolean => {
  const now = moment();
  if (active) {
    return checkDate.isAfter(now);
  }
  return checkDate.isBefore(now);
};

function Options(): JSX.Element {
  const [list, setList] = useState("active");
  const [optionDetailsList, setOptionDetailsList] = useState<OptionDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [optionDetail, setOptionDetail] = useState<OptionDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const {
    query: { option: optionId = "" },
  } = useRouter();

  const { data: account } = useAccount();
  const { data: signer } = useSigner();

  const fetchOptions = useCallback(async () => {
    setLoading(true);

    if (!account) {
      setLoading(false);
      return;
    }
    const userAccount = account.address.toLowerCase();

    if (!userAccount) {
      console.log("No user account, cannot fetch options");
      setLoading(false);
      return;
    }

    const userOptions = await getOptionsWithDetails(userAccount, signer);

    setOptionDetailsList(userOptions);
    setLoading(false);
  }, [account, signer]);

  const visibleOptions = useMemo(() => {
    const active = list === "active";
    return optionDetailsList.filter((item) =>
      shouldInclude(active, moment.unix(item.option.expiryTimestamp))
    );
  }, [list, optionDetailsList]);

  useEffect(() => {
    if (!loading) {
      if (optionDetailsList.length > 0 && optionId) {
        const option = optionDetailsList.find((o) => o.option.id === optionId);
        console.log(
          `got optionDetailsList (${optionDetailsList.length}) and option #${optionId}: ${option}`
        );
        setOptionDetail(option || null);
        setModalOpen(!!option);
      } else {
        console.log(
          `no optionDetailsList or option`,
          JSON.stringify({ optionDetailsList, optionId })
        );
        setModalOpen(false);
      }
    }
  }, [optionDetailsList, optionId, loading]);

  const handleOpenOptionModal = useCallback((optionData: OptionDetails) => {
    setOptionDetail(optionData);
    setModalOpen(true);
    Router.push(`/vault/options?option=${optionData.option.id}`);
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const pageBody = useMemo(() => {
    if (loading) {
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
      <div className="options">
        <ul>
          {visibleOptions.map((optionDetail) => {
            return (
              <li
                key={`item-${optionDetail?.option.id}`}
                className={`option ${list === "expired" ? "expired" : ""}`}
                onClick={() => handleOpenOptionModal(optionDetail)}
              >
                <div className="option-row">
                  <div className="option-datapoint">
                    <h5>Balance</h5>
                    <h4>{optionDetail?.balance?.toNumber().toString() || 0}</h4>
                  </div>
                </div>
                <div className="option-row">
                  <div className="option-datapoint">
                    <h5>Exercise Date</h5>
                    <h4>{formatDate(optionDetail, "exercise")}</h4>
                  </div>
                  <div className="option-datapoint">
                    <h5>Expiry Date</h5>
                    <h4>{formatDate(optionDetail, "expiry")}</h4>
                  </div>
                </div>
                <div className="option-row">
                  <div className="option-datapoint">
                    <h5>Underlying Asset Amount</h5>
                    <h4>
                      {formatAmount(optionDetail, "underlying")}{" "}
                      <span>(x {optionDetail?.balance.toNumber() || 0})</span>
                    </h4>
                  </div>
                  <div className="option-datapoint">
                    <h5>Exercise Asset Amount</h5>
                    <h4>
                      {formatAmount(optionDetail, "exercise")}{" "}
                      <span>(x {optionDetail?.balance.toNumber() || 0})</span>
                    </h4>
                  </div>
                </div>
                <Button
                  theme="purple-blue"
                  onClick={() => handleOpenOptionModal(optionDetail)}
                >
                  View Option
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }, [loading, visibleOptions, list, handleOpenOptionModal]);

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
          console.log("approved - implement me");
        }}
        onClose={() => {
          setModalOpen(false);
          Router.router.push("/vault/options").then(() => {
            // To make sure the options are (re)loaded closing the modal
            fetchOptions();
          });
        }}
      />
    </>
  );
}

export default Options;
