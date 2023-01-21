---
title: Override JWT `encode` and `decode` methods
sidebar_label: Custom JWT encoding
---

:::warning
If you use middleware to protect routes, make sure the same method is also set in the [`_middleware.ts` options](/reference/nextjs/#custom-jwt-decode-method)
:::

Auth.js uses encrypted JSON Web Tokens ([JWE](https://datatracker.ietf.org/doc/html/rfc7516)) by default. Unless you have a good reason, we recommend keeping this behaviour. Although you can override this using the `encode` and `decode` methods. Both methods must be defined at the same time.

```js
jwt: {
  async encode(params: {
    token: JWT
    secret: string
    maxAge: number
  }): Promise<string> {
    // return a custom encoded JWT string
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  },
  async decode(params: {
    token: string
    secret: string
  }): Promise<JWT | null> {
    // return a `JWT` object, or `null` if decoding failed
    return {}
  },
}
```
