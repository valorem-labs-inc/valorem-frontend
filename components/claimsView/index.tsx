import { FC, Fragment, useState } from "react";
import Link from "next/link";
import { useClaims } from "../../graphql/hooks/useClaims";
import { Claim } from "../../lib/types";
import BlankState from "../blankState";
import Button from "../button";
import ClaimModal from "../claimModal";
import Loader from "../loader";
import StyledClaims from "./index.css";

const ClaimsView: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const { claims, isLoading } = useClaims();

  return (
    <Fragment>
      <StyledClaims>
        <header>
          <h4>Claims</h4>
        </header>
        {isLoading && <Loader />}
        {!isLoading && claims.length === 0 && (
          <BlankState
            title="No claims found."
            subtitle="Once you hold claims NFTs, they will show here."
          />
        )}
        {!isLoading && claims.length > 0 && (
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
                  {claims.map((claim, index) => {
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

export default ClaimsView;
