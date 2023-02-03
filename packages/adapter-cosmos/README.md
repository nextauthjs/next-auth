<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" /></a><img height="64px" src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/adapter-cosmos/logo.svg" />
   <h3 align="center"><b>Cosmos DB Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="Build Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/cosmos-adapter/latest" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/cosmos-adapter" alt="@next-auth/firebase-adapter Version" />
   </p>
</p>

## Overview

This is the Azure Cosmos DB Adapter for [`auth.js`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package. Currently only supports NoSQL version of Azure Cosmos DB.

You can find more Azure Cosmos DB information in the docs at [authjs.dev/reference/adapters/cosmos](https://authjs.dev/reference/adapters/cosmos).

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

> **Azure Cosmos DB - Caution**: Currently, this library only works with NoSQL version of Azure Cosmos DB. If you wnat to make another versions of Azure Cosmos DB, [try making your own](https://next-auth.js.org/tutorials/creating-a-database-adapter) or [contritube](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md) to this repository.

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md).

## License

ISC
