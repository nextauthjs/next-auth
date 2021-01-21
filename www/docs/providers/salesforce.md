---
id: salesforce
title: Salesforce
---

## Documentation

https://help.salesforce.com/articleView?id=remoteaccess_authenticate.htm&type=5

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Salesforce({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
  })
}
...
```
