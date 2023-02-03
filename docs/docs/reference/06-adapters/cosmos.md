---
id: cosmos
title: CosmosDB
---

:::warning
This adapter is still experimental and does not work with Auth.js 4 or newer. If you would like to help out upgrading it, please visit [this PR](https://github.com/nextauthjs/next-auth/pull/3873)
:::

This is the Cosmos Adapter for [`next-auth`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install `next-auth` and `@next-auth/cosmos-adapter`.

```sh
npm install next-auth @next-auth/cosmos-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { CosmosAdapter } from "@next-auth/firebase-adapter"

const AdapterOptions: CosmosDBInitOptions = {
  clientOptions: {
    // For more information of cosmos db options, see
    // https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/cosmosclientoptions?view=azure-node-latest
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY,
  }
}

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/configuration/auth-options
export default NextAuth({
  // https://authjs.dev/reference/providers/oauth-builtin
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: CosmosAdapter(AdapterOptions),
  ...
})
```

## Options

When initializing the azure cosmos adapter, you must pass proper cosmos db initialize object. Details can be found in [here](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/quickstart-nodejs?tabs=azure-portal%2Clinux#create-a-code-file)

Database, Containers are automatically generated with your config object, but once it generated, will not be changed by changing config object. You must change it in Microsoft Portal yourself or delete Database or Containers.

An example Cosmos DB config looks like this:

```js

// Essential Object for functioning.

const cosmosDBBasicConfig = {
  clientOptions: {
    endpoint: "<cosmos-account-URI>",
    key: "<cosmos-account-PRIMARY-KEY>",
  },
}

// Detailed object of config.
// Object below is example, do not put it in your database config
const costmosDBDetailedConfig = {
  clientOptions: {
    endpoint: "<cosmos-account-URI>",
    key: "<cosmos-account-PRIMARY-KEY>",
  },
  // For more detail about db request options, see
  // https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/databaserequest?view=azure-node-latest
  dbOptions: {
    body: {
      id: "My Auth DB",
      autoUpgradePolicy: {
        throughputPolicy: {
          incrementalPercent: 30,
        }
      }
      maxThroughput: 4000,
      througput: 1000,
    },
    // Database and container has common request options parameters, For more details, see
    // https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/requestoptions?source=recommendations&view=azure-node-latest
    options: {
      disableAutomaticIdGeneration: false,
      enableScriptLogging: true,
    }
  }
  // This container options follows next-auth's models structure. For more details about models, see
  // https://next-auth.js.org/adapters/models
  containerOptions: {
    // For more detail about container request options, see
    // https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/containerrequest?view=azure-node-latest
    usersOptions: {
      body: {
        id: "MY_USERS_CONTAINER",
        uniqueKeyPolicy: {
          uniqueKeys: [{paths: ["/email"]}],
        },
        partitionKey: "/id",
      },
      options: {
        enableScriptLogging: false,
      }
    },
    accountsOptions: {
      body: {
        id: "MY_ACCOUNTS_CONTAINER",
      }
    },
    sessionsOptions: {
      body: {
        id: "MY_SESSIONS_CONTAINER",
      }
    },
    tokensOptions: {
      body: {
        id: "MY_TOKENS_CONTAINER",
      }
    },
  }
}
```
