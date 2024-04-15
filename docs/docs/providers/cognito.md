---
id: cognito
title: Amazon Cognito
---

## Documentation

https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html

## Configuration

https://console.aws.amazon.com/cognito/users/

You need to select your AWS region to go the the Cognito dashboard.

## Options

The **Amazon Cognito Provider** comes with a set of default options:

- [Amazon Cognito Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/cognito.ts)

You can override any of the options to suit your own use case.

## Example

```js
import CognitoProvider from "next-auth/providers/cognito";
...
providers: [
  CognitoProvider({
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
    issuer: process.env.COGNITO_ISSUER,
  })
]
...
```

:::tip
The issuer is a URL, that looks like this: `https://cognito-idp.{region}.amazonaws.com/{PoolId}`
:::

`PoolId` is from `General Settings` in Cognito, not to be confused with the App Client ID.

:::warning
Make sure you select all the appropriate client settings or the OAuth flow will not work.
:::

:::tip
Before you can set these settings, you must [set up an Amazon Cognito hosted domain](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain.html)
:::

![cognito](https://private-user-images.githubusercontent.com/11452899/297044112-41954090-1169-4c1b-9f09-ae7ee80a7cbd.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTMyMTI1ODksIm5iZiI6MTcxMzIxMjI4OSwicGF0aCI6Ii8xMTQ1Mjg5OS8yOTcwNDQxMTItNDE5NTQwOTAtMTE2OS00YzFiLTlmMDktYWU3ZWU4MGE3Y2JkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA0MTUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNDE1VDIwMTgwOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFmY2YzZjExOGNkYTdiY2JjZjc4ZmRjZTIyYWI5NzU5ZmRiNzdmMjEwOTkzMWY5MzRjODc0Y2NjODgwZjMzNDgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.ic0p91xFA7YGbdf2wP5OfzpjkI3p70uGDmAU8a5ir1M)
