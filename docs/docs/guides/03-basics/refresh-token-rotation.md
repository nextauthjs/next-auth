---
title: Refresh token rotation
---

Refresh token rotation is the practice of updating an `access_token` on behalf of the user, without requiring interaction (eg.: re-sign in). `access_token`s are usually issued for a limited time. After they expire, the service verifying them will ignore the value. Instead of asking the user to sign in again to obtain a new `access_token`, certain providers support exchanging a `refresh_token` for a new `access_token`, renewing the expiry time. Let's see how this can be achieved.

:::note
Our goal is to add zero-config support for built-in providers eventually. Let us know if you would like to help.
:::

## Implementation

First, make sure that the provider you want to use supports `refresh_token`'s. Check out [The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749#section-6) spec for more details.

### Server Side

Depending on the session strategy, `refresh_token` can be persisted either in a database, or in a cookie, in an encrypted JWT.

:::info
Using a JWT to store the `refresh_token` is less secure than saving it in a database, and you need to evaluate based on your requirements which strategy you choose.
:::

#### JWT strategy

Using the [jwt](../../reference/core/types#jwt) and [session](../../reference/core/types#session) callbacks, we can persist OAuth tokens and refresh them when they expire.

Below is a sample implementation using Google's Identity Provider. Please note that the OAuth 2.0 request in the `refreshAccessToken()` function will vary between different providers, but the core logic should remain similar.

```ts
import { Auth } from "@auth/core"
import { type TokenSet } from "@auth/core/types"
import Google from "@auth/core/providers/google"

export default Auth(new Request("https://example.com"), {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + account.expires_in),
          refresh_token: account.refresh_token,
        }
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_ID,
              client_secret: process.env.GOOGLE_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
            method: "POST",
          })

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          }
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const }
        }
      }
    },
    async session({ session, token }) {
      session.error = token.error
      return session
    },
  },
})

declare module "@auth/core/types" {
  interface Session {
    error?: "RefreshAccessTokenError"
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: "RefreshAccessTokenError"
  }
}
```

#### Database strategy

Using the database strategy is very similar, but instead of preserving the `access_token` and `refresh_token`, we save it, well, in the database.

```ts
import { Auth } from "@auth/core"
import { type TokenSet } from "@auth/core/types"
import Google from "@auth/core/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default Auth(new Request("https://example.com"), {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const [google] = await prisma.account.findMany({
        where: { userId: user.id, provider: "google" },
      })
      if (google.expires_at * 1000 < Date.now()) {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_ID,
              client_secret: process.env.GOOGLE_SECRET,
              grant_type: "refresh_token",
              refresh_token: google.refresh_token,
            }),
            method: "POST",
          })

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          await prisma.account.update({
            data: {
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
              refresh_token: tokens.refresh_token ?? google.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: google.providerAccountId,
              },
            },
          })
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property will be used client-side to handle the refresh token error
          session.error = "RefreshAccessTokenError"
        }
      }
      return session
    },
  },
})

declare module "@auth/core/types" {
  interface Session {
    error?: "RefreshAccessTokenError"
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: "RefreshAccessTokenError"
  }
}
```

### Client Side

The `RefreshAccessTokenError` error that is caught in the `refreshAccessToken()` method is passed to the client. This means that you can direct the user to the sign-in flow if we cannot refresh their token.

We can handle this functionality as a side effect:

```js title="pages/home.js"
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const HomePage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

return (...)
}
```

## Source Code

A working example can be accessed [here](https://github.com/nextauthjs/next-auth-refresh-token-example).

