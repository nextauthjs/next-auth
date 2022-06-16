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

In `.env` add the following entries:

```
NEXTAUTH_URL=<Your application url e.g: http://localhost:3000>
SECRET=<Your secret here>
ASGARDEO_CLIENT_ID=<copy Application (client) ID here>
ASGARDEO_CLIENT_SECRET=<copy generated client secret value here>
ASGARDEO_ISSUER=<copy the serverOrigin param taken from asgardeo console here>
```

In `pages/api/auth/[...nextauth].js` find or add the `Asgardeo` entries:

```js
import AsgardeoProvider from "next-auth/providers/asgardeo";
...
providers: [
  AsgardeoProvider({
    clientId: process.env.ASGARDEO_CLIENT_ID,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
    issuer: process.env.ASGARDEO_ISSUER
  }),
],
secret: process.env.SECRET,
session: {
  strategy: "jwt",
},
  
...
```
