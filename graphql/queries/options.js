import gql from "graphql-tag";

export const options = gql`
  query ClaimsAndOptionsBalances($account: String) {
    account(id: $account) {
      ERC1155balances(where: { valueExact_gt: "0" }) {
        token {
          type
          option {
            creator {
              id
            }
            exerciseAmount
            exerciseAsset {
              id
            }
            exerciseTimestamp
            expiryTimestamp
            id
            underlyingAmount
            underlyingAsset {
              id
            }
          }
          id
        }
        valueExact
      }
    }
  }
`;
