---
id: identity-server4
title: IdentityServer4
---

## Documentation

https://identityserver4.readthedocs.io/en/latest/


## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.IdentityServer4({
    id: "identity-server4", 
    name: "IdentityServer4", 
    scope: "openid profile email api offline_access", // Allowed Scopes
    domain:  process.env.IdentityServer4_Domain,
    clientId: process.env.IdentityServer4_CLIENT_ID,
    clientSecret: process.env.IdentityServer4_CLIENT_SECRET
  })
]
...
```

## Demo IdentityServer

The configuration below is for the demo server at https://demo.identityserver.io/

If you want to try it out, you can copy and paste the configuration below.

You can sign in to the demo service with either <b>bob/bob</b> or <b>alice/alice</b>.
 
```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.IdentityServer4({
    id: "demo-identity-server",  
    name: "Demo IdentityServer4", 
    scope: "openid profile email api offline_access", 
    domain:  "demo.identityserver.io",
    clientId: "server.code",
    clientSecret: "secret"
  })
}
...
