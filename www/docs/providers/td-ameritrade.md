---
id: td
title: TD Ameritrade
---

## Documentation

https://developer.tdameritrade.com/content/authentication-faq

## Example

```js
import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  providers: [
    Providers.TDAmeritrade({
      clientId: process.env.TD_CLIENT_ID,
    }),
  ],
  // Everything below this point is for refresh token rotation in case you
  // want to use access tokens to query the TD Ameritrade API
  callbacks: {
    async jwt(token, _, account) {
      // Initial sign in
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session(session, token) {
      session.accessToken = token.accessToken
      return session
    },
  },
})

...

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url =
      "https://api.tdameritrade.com/v1/oauth2/token?" +
      new URLSearchParams({
        client_id: process.env.TD_CLIENT_ID,
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

...

```

## Instructions

### Configuration

:::tip
An app must be created at https://developer.tdameritrade.com/user/me/apps
:::

- Set the 'Callback URL' to: http://localhost:3000/api/auth/callback/td

- Add an environment variable TD_CLIENT_ID that matches the pattern: `${TD_CONSUMER_KEY}@AMER.OAUTHAP` where `TD_CONSUMER_KEY` is the Consumer Key of the app you created.
