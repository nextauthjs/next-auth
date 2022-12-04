---
id: asgardeo
title: Asgardeo
---

## Documentation

https://wso2.com/asgardeo/docs/guides/authentication


## Instructions

- Log into https://console.asgardeo.io.
- Next, go to "Application" tab (More info: https://wso2.com/asgardeo/docs/guides/applications/register-oidc-web-app/).
- Register standard based - Open id connect, application
- After registring the application, go to protocol tab.
- Check `code` grant type.
- Add Authorized redirect URLs & Allowed origins fields.
- Make Email, First Name, Photo URL user attributes mandatory from the console.

Create a `.env` file in the project root add the following entries:

These values can be collected from the application created.

```
ASGARDEO_CLIENT_ID=<Copy client ID from protocol tab here>
ASGARDEO_CLIENT_SECRET=<Copy client from protocol tab here>
ASGARDEO_ISSUER=<Copy the issuer url from the info tab here>
```

In `pages/api/auth/[...nextauth].js` find or add the `Asgardeo` entries:

```js
import Asgardeo from "next-auth/providers/asgardeo";
...
providers: [
  Asgardeo({
    clientId: process.env.ASGARDEO_CLIENT_ID,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
    issuer: process.env.ASGARDEO_ISSUER
  }),
],
  
...
```
