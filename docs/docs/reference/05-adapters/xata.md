---
id: xata
title: Xata
---

# Xata

This adapter allows using next-auth with Xata as a database to store users, sessions, and more. The preferred way to create a Xata project and use Xata databases is using the [Xata Command Line Interface (CLI)](https://docs.xata.io/cli/getting-started). The CLI allows generating a `XataClient` that will help you work with Xata in a safe way, and that this adapter depends on.

<!-- @todo add GIFs -->

## Getting Started

Let's first make sure we have everything installed and configured. We're going to need:

- next-auth + adapter
- the Xata CLI
- to configure the CLI

We can do this like so:

```bash npm2yarn2pnpm
# Install next-auth + adapter
npm install next-auth @next-auth/xata-adapter

# Install the Xata CLI globally if you don't already have it
npm install --location=global @xata.io/cli

# Login
xata auth login
```

Now that we're ready, let's create a new Xata project using our next-auth schema that the Xata adapter can work with. To do that, copy and paste this schema file into your project's directory:

```json title="schema.json"
{
  "formatVersion": "",
  "tables": [
    {
      "name": "nextauth_users",
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
        }
      ]
    },
    {
      "name": "nextauth_accounts",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "nextauth_users"
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
          "type": "text"
        },
        {
          "name": "session_state",
          "type": "string"
        }
      ]
    },
    {
      "name": "nextauth_verificationTokens",
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
      "name": "nextauth_users_accounts",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "nextauth_users"
          }
        },
        {
          "name": "account",
          "type": "link",
          "link": {
            "table": "nextauth_accounts"
          }
        }
      ]
    },
    {
      "name": "nextauth_users_sessions",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "nextauth_users"
          }
        },
        {
          "name": "session",
          "type": "link",
          "link": {
            "table": "nextauth_sessions"
          }
        }
      ]
    },
    {
      "name": "nextauth_sessions",
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
            "table": "nextauth_users"
          }
        }
      ]
    }
  ]
}
```

Now, run the following command:

```bash
xata init --schema=./path/to/your/schema.json
```

The CLI will walk you through a setup process where you choose a [workspace](https://docs.xata.io/concepts/workspaces) (kind of like a GitHub org or a Vercel team) and an appropriate database. We recommend using a fresh database for this, as we'll augment it with tables that next-auth needs.

Once you're done, you can continue using next-auth in your project as expected, like creating a `./pages/api/auth/[...nextauth]` route.

```typescript title="pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const client = new XataClient()

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

Now to Xata-fy this route, let's add the Xata client and adapter:

```diff
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
+import { XataAdapter } from "@next-auth/xata-adapter"
+import { XataClient } from "../../../xata" // or wherever you've chosen to create the client

+const client = new XataClient()

export default NextAuth({
+ adapter: XataAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

This fully sets up your next-auth site to work with Xata.

## Contributing

This is an open-source project created by humans, and as such, might have a few issues. If you experience any of these, we recommend [opening issues](https://github.com/nextauthjs/next-auth/issues/new?assignees=&labels=triage&template=1_bug_framework.yml&title=Issue%20on%20Xata%20adapter&description=I%20experienced%20this%20issue:\n##%20Reproduction%20Steps:\n\n-) that can help us solve problems and build reliable software.
