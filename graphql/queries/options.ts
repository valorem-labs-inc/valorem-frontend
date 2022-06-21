import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const optionsByAccountQuery: DocumentNode = gql`
  query OptionsBalances($account: String) {
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

export const optionQuery: DocumentNode = gql`
  query OptionDetails($account: String, $token: String) {
    erc1155Balances(where: { account: $account, token: $token }) {
      valueExact
      token {
        identifier
        option {
          exerciseAmount
          exerciseAsset {
            id
          }
          exerciseTimestamp
          expiryTimestamp
          underlyingAmount
          underlyingAsset {
            id
          }
        }
      }
    }
  }
`;
