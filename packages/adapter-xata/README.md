<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="logo.svg" />
   <h3 align="center"><b>Xata Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/xata-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/xata-adapter/next" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/xata-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/xata-adapter/next" alt="@next-auth/xata-adapter Version" /></a>
   </p>
</p>

## Overview

This is the Xata Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the expected schema Xata expects to work with this adapter below. If you'd like to set up a database on Xata to work with next-auth, you can restore this file to your database with `xata schema restore [./path/to/schema.json]`. More in the [docs](https://docs.xata.io/cli/getting-started).

### Xata Schema

```json
{
  "formatVersion": "",
  "tables": [
    {
      "name": "users",
      "columns": [
        {
          "name": "email",
          "type": "email"
        },
        {
          "name": "emailVerified",
          "type": "datetime"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "location",
          "type": "string"
        }
      ]
    },
    {
      "name": "accounts",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "type",
          "type": "string"
        },
        {
          "name": "provider",
          "type": "string"
        },
        {
          "name": "providerAccountId",
          "type": "string"
        },
        {
          "name": "refresh_token",
          "type": "string"
        },
        {
          "name": "access_token",
          "type": "string"
        },
        {
          "name": "expires_at",
          "type": "int"
        },
        {
          "name": "token_type",
          "type": "string"
        },
        {
          "name": "scope",
          "type": "string"
        },
        {
          "name": "id_token",
          "type": "string"
        },
        {
          "name": "session_state",
          "type": "string"
        }
      ]
    },
    {
      "name": "verificationTokens",
      "columns": [
        {
          "name": "identifier",
          "type": "string"
        },
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "expires",
          "type": "datetime"
        }
      ]
    },
    {
      "name": "users_accounts",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "account",
          "type": "link",
          "link": {
            "table": "accounts"
          }
        }
      ]
    },
    {
      "name": "users_sessions",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "session",
          "type": "link",
          "link": {
            "table": "sessions"
          }
        }
      ]
    },
    {
      "name": "sessions",
      "columns": [
        {
          "name": "sessionToken",
          "type": "string"
        },
        {
          "name": "expires",
          "type": "datetime"
        },
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        }
      ]
    }
  ]
}
```

## Getting Started

1. Install `next-auth` and `@next-auth/xata-adapter`.
2. Initialize your Xata project with `npx @xata.io/cli init`. More in the [docs](https://docs.xata.io/cli/getting-started).

```js
npm install next-auth @next-auth/xata-adapter
npx @xata.io/cli init
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { XataAdapter } from "@next-auth/xata-adapter"
import { XataClient } from "../../../xata/client" // or wherever you've stored your Xata client

const client = new XataClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: XataAdapter(client)
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
