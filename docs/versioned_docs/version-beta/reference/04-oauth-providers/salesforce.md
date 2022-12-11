---
id: salesforce
title: Salesforce
---

## Documentation

https://help.salesforce.com/articleView?id=remoteaccess_authenticate.htm&type=5

## Options

The **Salesforce Provider** comes with a set of default options:

- [Salesforce Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/salesforce.js)

You can override any of the options to suit your own use case.

## Example

```js
import SalesforceProvider from "next-auth/providers/salesforce";
...
providers: [
  SalesforceProvider({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
  })
]
...
```
