import { BigNumber } from "ethers";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { SiteStore } from "../../lib/store";
import { Claim, Wallet } from "../../lib/types";
import Button from "../button";
import StyledModal, { ModalBackdrop } from "../modal";

type ClaimProps = {
  claim: Claim | null;
  onClose: () => void;
  open: boolean;
};

function ClaimModal(props: ClaimProps): JSX.Element {
  const [ loading, setLoading ] = useState(false);
  const [ hasClaim, setHasClaim ] = useState<any>(null);

  const { claim, onClose, open } = props;
  const wallet: Wallet = useSelector((state: SiteStore) => state.wallet);
  
  const fetchClaimBalance = useCallback(async () => {
    if (wallet) {
      setLoading(true);

      const { contract, accounts } = wallet;
      const userAccount = accounts[0].toLowerCase();
      const balance = await contract.balanceOf(userAccount, claim.id);
      setHasClaim(balance.toNumber() === 1 ? true : false);
      setLoading(false);
    }
  }, [ wallet, claim.id ]);

  // fetch claim on initial load
  useEffect(() => {
    fetchClaimBalance();
  }, [ fetchClaimBalance ]);
  
  const handleRedeemClaim = useCallback(async () => {
    if (wallet) {
      const { contract, signer } = wallet;
      await contract.connect(signer).redeem(claim.id);
    }
    onClose();
  }, [claim.id, onClose, wallet]);

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
    )
  }, [loading]);

  return (
    <>
      <ModalBackdrop open={open}>
        <StyledModal className="modal">
          <i className="fas fa-xmark" onClick={onClose} />
          { modalBody }
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
