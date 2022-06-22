# valorem-frontend

0. Getting Started
1. Settings
2. GraphQL
3. Wallets/Ethers

## Getting Started

In order to run the app in development, the `npm run dev` command is best. This runs the Next.js development server for the app. From your terminal at the root of the project:

```javascript
npm run dev
```

If you need to run a build of the site, the `npm run build` command is best. This runs the Next.js build for the app. From your terminal at the root of the project:

```javascript
npm run build
```

## Settings

All environment settings are stored in the `next.config.js` file, utilizing that files `env` object to store variables on the Node `process.env` object. Of note, in some situations Next.js doesn't load these values quickly enough, so the `next.config.js` file is imported directly into the source (e.g, in `/graphql/client.ts`).

## GraphQL

For subgraph access, the app uses the Apollo GraphQL library. The connection to the subgraph is established in `/graphql/client.ts` with individual queries being defined by their "topic" in the `/graphql/queries` folder. The convention here (which also applies to mutations in `/graphql/mutations` if any are added) is to import the `gql` function from the `graphql-tag` package and from the file, provide a named export for your query that can be imported into the UI:

```javascript
import gql from "graphql-tag";

export const claims = gql`
  query claims($where: Claim_filter) {
    claims(where: $where) {
      id
      option
      underlyingAmount
      underlyingAsset {
        id
      }
      writer {
        id
      }
      claimed
      exerciseAmount
      amountWritten
      amountExercised
    }
  }
`;
```

For simplicity, the GraphQL client and queries are imported directly into the UI for querying. For example, in `/pages/vault/claims/index.ts`:

```javascript
import Router from 'next/router';
import React from 'react';
import Link from 'next/link';
...
import store from '../../../lib/store';
import graphql from '../../../graphql/client';
import { claims as claimsQuery } from '../../../graphql/queries/claims';
import unfreezeApolloCacheValue from '../../../lib/unfreezeApolloCacheValue';

import StyledClaims from './index.css';

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
          where: {
            redeemer: state?.wallet?.connection?.accounts[0],
          },
        },
      });

      const sanitizedData = unfreezeApolloCacheValue(data?.claims || []);

      this.setState({
        loading: false,
        claims: sanitizedData,
      });
    });
  };

  render() {
    const { loading, claims } = this.state;

    return (
      <Vault>
        ...
      </Vault>
    );
  }
}

Claims.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Claims;
```

When running a query, responses returned from Apollo include extra metadata on the objects which can make referencing the data difficult. To mitigate this, the `unfreezeApolloCache()` function is used (imported from `/lib`) which will recursively scrub any of this metadata from the return value of a query, returning a plain JavaScript object (or array of objects).

## Wallets/Ethers

For wallet connections, the web3modal library is used. In order to perform the connection when the user clicks the "Connect Wallet" button on the index page, the `/lib/connectWallet.js` function is fired which simultaneously handles the creation of the web3modal instance, gets a structured connection to the wallet via the Ethers library in `/lib/getWalletConnection.ts`, and then finally stores that connection in the global Redux store initialized at `/lib/store.js`.

Once this connection is obtained and stored in the Redux store, it's referenced while the user is connected to the app. If they refresh the page (or close the tab), the wallet connection is removed from the store and the user is redirected to the index and asked to reconnect.

For performing RPC requests, the Ethers connection obtained in `/lib/getWalletConnection.ts` is utilized. Depending on the task, either the existing Ethers wallet connection is used, or, a new one is established (e.g., when needing access to the ERC-20 contract). The best example of this usage is located in `/pages/vault/options/new/index.ts`.
