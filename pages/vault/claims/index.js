import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import Button from "../../../components/button";
import Vault from "../../../layouts/vault";
import Loader from "../../../components/loader";
import BlankState from "../../../components/blankState";
import store from "../../../lib/store";
import graphql from "../../../graphql/client";
import { claims as claimsQuery } from "../../../graphql/queries/claims";
import unfreezeApolloCacheValue from "../../../lib/unfreezeApolloCacheValue";

import StyledClaims from "./index.css.js";

class Claims extends React.Component {
  state = {
    loading: true,
    claims: [],
  };

  componentDidMount() {
    this.handleFetchClaims();
  }

  handleFetchClaims = async () => {
    this.setState({ loading: true }, async () => {
      const state = store.getState();
      const { data } = await graphql.query({
        query: claimsQuery,
        skip: !state?.wallet?.connection?.accounts[0],
        variables: {
          account: state?.wallet?.connection?.accounts[0].toLowerCase(),
        },
      });
      const claims = data?.account?.ERC1155balances.filter(
        (item) => item.token.type === 2
      );
      const sanitizedData = unfreezeApolloCacheValue(claims || []);

      this.setState({
        loading: false,
        claims: sanitizedData,
      });
    });
  };

  render() {
    const { loading, claims } = this.state;

    // TODO(Collateral claim/redeem)
    // TODO(These are only claimable after expiry)
    // If the token is unclaimed and not yet expired, the user should see a grey claim button
    // TODO(View option detail)
    return (
      <Vault>
        <StyledClaims>
          <header>
            <h4>Claims</h4>
          </header>
          {loading && <Loader />}
          {!loading && claims?.length === 0 && (
            <BlankState
              title="No claims found."
              subtitle="Once you hold claims NFTs, they will show here."
            />
          )}
          {!loading && claims?.length > 0 && (
            <div className="claims">
              <div className="responsive-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-center">Option Details</th>
                      <th className="text-center">Contracts Written</th>
                      <th className="text-center">Redeem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims?.map((item, index) => {
                      return (
                        <tr key={`claim-${item}-${index}`}>
                          <td className="text-center">
                            <Link
                              href={`/vault/options?option=${item?.token?.claim?.option}`}
                            >
                              View Option
                            </Link>
                          </td>
                          <td className="text-center">
                            {item?.token?.claim?.amountWritten || 0}
                          </td>
                          <td className="text-center">
                            <Button
                              disabled={item?.token?.claim?.claimed}
                              theme="purple-blue"
                            >
                              {item?.token?.claim?.claimed
                                ? "Claimed"
                                : "Claim"}
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
    );
  }
}

Claims.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default connect((state) => {
  return state;
})(Claims);
