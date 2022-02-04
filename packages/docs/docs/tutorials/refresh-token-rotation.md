---
id: refresh-token-rotation
title: Refresh Token Rotation
---

While NextAuth.js doesn't automatically handle access token rotation for OAuth providers yet, this functionality can be implemented using [callbacks](https://next-auth.js.org/configuration/callbacks).

## Source Code

A working example can be accessed [here](https://github.com/nextauthjs/next-auth-refresh-token-example).

## Implementation

### Server Side

Using a [JWT callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) and a [session callback](https://next-auth.js.org/configuration/callbacks#session-callback), we can persist OAuth tokens and refresh them when they expire.

Below is a sample implementation using Google's Identity Provider. Please note that the OAuth 2.0 request in the `refreshAccessToken()` function will vary between different providers, but the core logic should remain similar.

```js title="pages/auth/[...nextauth.js]"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  })

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },
})
```

### Client Side

The `RefreshAccessTokenError` error that is caught in the `refreshAccessToken()` method is passed all the way to the client. This means that you can direct the user to the sign in flow if we cannot refresh their token.

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
