---
id: concept2
title: Concept2
---

## Documentation

https://log.concept2.com/developers/documentation/

## Configuration

https://log.concept2.com/developers/keys

## Options

The **Concept2 Provider** comes with a set of default options:

- [Concept2 Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/concept2.ts)

You can override any of the options to suit your own use case.

## Example

```js
import Concept2Provider from "next-auth/providers/concept2";
...
providers: [
  Concept2Provider({
    clientId: process.env.CONCEPT2_CLIENT_ID,
    clientSecret: process.env.CONCEPT2_CLIENT_SECRET
  })
]
...
```
