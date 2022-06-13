import gql from "graphql-tag";

export const claims = gql`
  query ClaimsAndOptionsBalances($account: String) {
    account(id: $account) {
      ERC1155balances(where: { valueExact_gt: "0" }) {
        id
        token {
          type
          option {
            id
            expiryTimestamp
          }
          id
          claim {
            amountExercised
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

// export const claimDetails = gql`
//   // query ClaimDetails($account: String, $token: String) {}
// `;
