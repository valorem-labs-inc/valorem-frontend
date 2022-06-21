import Link from "next/link";
import React from "react";
import { connect } from "react-redux";

import BlankState from "../../../components/blankState";
import Button from "../../../components/button";
import ClaimModal from "../../../components/claimModal";
import Loader from "../../../components/loader";
import Vault from "../../../layouts/vault";
import { smartFormatCurrency } from "../../../lib/currencyFormat";
import getClaims from "../../../lib/getClaims";
import store, { SiteStore } from "../../../lib/store";
import { Claim } from "../../../lib/types";
import StyledClaims from "./index.css";

async function fetchClaims(): Promise<Claim[]> {
  const state: SiteStore = store.getState();
  const { wallet } = state;
  let claims: string[] = [];

  if (!wallet) {
    console.warn('No wallet, cannot fetch claims');
  } else {
    const account = wallet.accounts[0];
    if (account) {
      return getClaims(account);
    }
  }
  return [];
}

type ClaimsProps = {
};

type ClaimsState = {
  loading: boolean;
  claims: any[];
  modalOpen: boolean;
  selectedClaim: Claim | null;
};

class Claims extends React.Component<ClaimsProps, ClaimsState> {
  state: ClaimsState = {
    loading: true,
    claims: [],
    modalOpen: false,
    selectedClaim: null,
  };

  componentDidMount() {
    this.handleFetchClaims();
  }

  handleFetchClaims = async (): Promise<void> => {
    this.setState({ loading: true }, async () => {
      const claims = await fetchClaims();
      this.setState({
        loading: false,
        claims,
      });
    });
  };

  handleOpenModal = (claim: Claim): void => {
    this.setState({ selectedClaim: claim, modalOpen: true });
  };

  render() {
    const { loading, claims, modalOpen, selectedClaim } = this.state;

    // TODO(Collateral claim/redeem)
    // TODO(These are only claimable after expiry)
    // If the token is unclaimed and not yet expired, the user should see a grey claim button
    // TODO(View option detail)
    return (
      <React.Fragment>
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
                                onClick={() => this.handleOpenModal(claim)}
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
              this.setState({ modalOpen: false, selectedClaim: null });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default connect((state) => {
  return state;
})(Claims);

