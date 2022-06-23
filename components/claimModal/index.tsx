import { BigNumber } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAccount, useContract, useContractRead, useSigner } from "wagmi";
import getConfigValue from "../../lib/getConfigValue";

import { Claim } from "../../lib/types";
import optionsSettlementEngineABI from "../../lib/abis/optionsSettlementEngine";
import Button from "../button";
import StyledModal, { ModalBackdrop } from "../modal";

type ClaimProps = {
  claim: Claim | null;
  onClose: () => void;
  open: boolean;
};

function ClaimModal(props: ClaimProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [hasClaim, setHasClaim] = useState<any>(null);

  const { claim, onClose, open } = props;

  const { data: account } = useAccount();
  const { data: signer } = useSigner();

  const optionsSettlementEngineAddress = getConfigValue("contract.address");

  const contract = useContract({
    addressOrName: optionsSettlementEngineAddress,
    contractInterface: optionsSettlementEngineABI,
    signerOrProvider: signer,
  });

  const { data: claimBalance } = useContractRead(
    {
      addressOrName: optionsSettlementEngineAddress,
      contractInterface: optionsSettlementEngineABI,
    },
    "balanceOf",
    {
      args: [account?.address.toLowerCase(), claim.id],
    }
  );

  useEffect(() => {
    setHasClaim(claimBalance.toNumber() === 1 ? true : false);
  }, [claimBalance]);

  const handleRedeemClaim = useCallback(async () => {
    if (account) {
      await contract.connect(signer).redeem(claim.id);
    }
    onClose();
  }, [account, claim.id, contract, onClose, signer]);

  const modalBody = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <div className="option-row">
          <div className="option-datapoint">
            <h5>Balance</h5>
            <h4>1</h4>
          </div>
          <div className="option-datapoint">
            <h5>Expiry Date</h5>
            <h4>Jun 30th, 2022</h4>
          </div>
        </div>
        <div className="option-row">
          <div className="option-datapoint">
            <h5>Underlying Asset Amount</h5>
            <h4>
              1 WETH <span>(x 1)</span>
            </h4>
          </div>
          <div className="option-datapoint">
            <h5>Exercise Asset Amount</h5>
            <h4>
              1 DAI <span>(x 1)</span>
            </h4>
          </div>
        </div>
      </>
    );
  }, [loading]);

  return (
    <>
      <ModalBackdrop open={open}>
        <StyledModal className="modal">
          <i className="fas fa-xmark" onClick={onClose} />
          {modalBody}
          <div className="button-group">
            <Link href={`/vault/options?option=${claim.option.id}`}>
              <a>
                <Button theme="cool-gray">View Option</Button>
              </a>
            </Link>
            <Button
              disabled={loading || !hasClaim}
              theme="purple-blue"
              onClick={handleRedeemClaim}
            >
              Redeem
            </Button>
          </div>
        </StyledModal>
      </ModalBackdrop>
    </>
  );
}

export default ClaimModal;
