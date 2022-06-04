import gql from "graphql-tag";

export const claims = gql`
  query ClaimsAndOptionsBalances($account: String) {
    account(id: $account) {
      ERC1155balances(where: { valueExact_gt: "0" }) {
        token {
          type
          option {
            id
            expiryTimestamp
          }
          id
          claim {
            amountWritten
            claimed
            option
          }
        }
        valueExact
      }
    }
  }
`;
