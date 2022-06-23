import { NextPage } from "next";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useAccount } from "wagmi";

import BlankState from "../../../components/blankState";
import Button from "../../../components/button";
import ClaimModal from "../../../components/claimModal";
import Loader from "../../../components/loader";
import Vault from "../../../layouts/vault";
import getClaims from "../../../lib/getClaims";
import { Claim } from "../../../lib/types";
import StyledClaims from "./index.css";

const ClaimsPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const { data: account } = useAccount();

  useEffect(() => {
    const fetchClaims = (account: string) => {
      return getClaims(account);
    };

    setLoading(true);

    if (account) {
      fetchClaims(account.address).then((_claims) => {
        setClaims(_claims);
        setLoading(false);
      });
    }
  }, [account]);

  return (
    <Fragment>
      <Vault>
        <StyledClaims>
          <header>
            <h4>Claims</h4>
          </header>
          {loading && <Loader />}
          {!loading && claims.length === 0 && (
            <BlankState
              title="No claims found."
              subtitle="Once you hold claims NFTs, they will show here."
            />
          )}
          {!loading && claims.length > 0 && (
            <div className="claims">
              <div className="responsive-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-center">Option Details</th>
                      <th className="text-center">Contracts Written</th>
                      <th className="text-center">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim: Claim, index) => {
                      return (
                        <tr key={`claim-${claim.id}`}>
                          <td className="text-center">
                            <Link
                              href={`/vault/options?option=${claim.option.id}`}
                            >
                              View Option
                            </Link>
                          </td>
                          <td className="text-center">
                            {claim.amountWritten || 0}
                          </td>
                          <td className="text-center">
                            <Button
                              disabled={claim.claimed}
                              onClick={() => {
                                setSelectedClaim(claim);
                                setModalOpen(true);
                              }}
                              theme="purple-blue"
                            >
                              View Claim
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </StyledClaims>
      </Vault>
      {selectedClaim && (
        <ClaimModal
          open={modalOpen}
          claim={selectedClaim}
          onClose={() => {
            setModalOpen(false);
            setSelectedClaim(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default ClaimsPage;
