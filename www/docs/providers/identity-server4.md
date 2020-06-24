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
}
...
```


## Example using Demo IdentityServer
https://demo.identityserver.io/

**The demo below is using a live server!  You can copy and paste the values below and it will work out of the box.
  This intended as an example only. (use either <b>bob/bob</b>, <b>alice/alice</b>) 
 
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
