---
id: xata
title: Xata
---

# Xata

This adapter is intended to be used with Xata projects. The preferred way to create a Xata project and use Xata databases is using the [Xata CLI](https://docs.xata.io/cli/getting-started). The CLI allows generating a `XataClient` that will help you work with Xata in a safe way, and that this adapter depends on.

<!-- @todo add GIFs -->

```bash npm2yarn2pnpm
npm install next-auth @next-auth/xata-adapter
npm install --location=global @xata.io/cli
xata auth login
xata init
```

Configure your `./pages/api/auth/[...nextauth]` route to use the Xata adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { XataAdapter } from "@next-auth/xata-adapter"
import { XataClient } from "../../../../xata.ts" // or wherever you've chosen to create the client

const client = new XataClient()

export default NextAuth({
  adapter: XataAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

Schema for the Xata Adapter (`@next-auth/prisma-adapter`)

## Setup

To get setup with this adapter, you'll need to create a database on Xata and create a schema (a collection of tables with specific structures) that next-auth can use. You can do this using the `xata schema restore` command from the Xata CLI. To do this, copy and paste the following schema into a `.json` file somewhere on your file system:

```json title="schema.json"
{
  "formatVersion": "1.0.0",
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

Once you've done that, run `xata schema restore [./path/to/this/file.json]` from the Xata CLI, and your database will be ready to use with next-auth, assuming you've already authenticated with Xata and you're ready to go. If you haven't, please [authenticate first](https://docs.xata.io/cli/getting-started#usage) and follow these steps.

Once your database is ready, your next-auth routes should _just work_ and send all relevant data to Xata.

## Contributing

This is an open-source project created by humans, and as such, might have a few issues. If you experience any of these, we recommend [opening issues](https://github.com/nextauthjs/next-auth/issues/new?assignees=&labels=triage&template=1_bug_framework.yml&title=Issue%20on%20Xata%20adapter&description=I%20experienced%20this%20issue:\n##%20Reproduction%20Steps:\n\n-) that can help us solve problems and build reliable software.
