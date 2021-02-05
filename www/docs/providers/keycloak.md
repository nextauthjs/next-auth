---
id: keycloak 
title: Keycloak
---

## Documentation

[Keycloak OIDC-Client configuration](https://www.keycloak.org/docs/6.0/server_admin/#oidc-clients)

Make sure to set the URLs in the keycloak client configuration properly:

* Base URL: http://localhost:3000/api/auth/callback/keycloak
* Valid redirect URIs: http://localhost:3000/*

## Example

```dotenv
# env.local
KEYCLOAK_BASE_URL=http://localhost:8080/auth/realms/master/protocol/openid-connect
KEYCLOAK_CLIENT_SECRET=yourclientsecret
KEYCLOAK_CLIENT_ID=yourclientid
```

```js
// pages/api/auth/[...nextauth].js
import Providers from 'next-auth/providers'

...
providers: [
    Providers.Keycloak({
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
        accessTokenUrl: `${process.env.KEYCLOAK_BASE_URL}/token`,
        requestTokenUrl: `${process.env.KEYCLOAK_BASE_URL}/auth`,
        authorizationUrl: `${process.env.KEYCLOAK_BASE_URL}/auth?response_type=code`,
        profileUrl: `${process.env.KEYCLOAK_BASE_URL}/userinfo`
    }),
]
...
```

