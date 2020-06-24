---
id: mixer
title: Mixer
---

## Documentation

https://dev.mixer.com/reference/oauth

## Configuration

https://mixer.com/lab/oauth

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Mixer({
    clientId: process.env.MIXER_CLIENT_ID,
    clientSecret: process.env.MIXER_CLIENT_SECRET
  })
}
...
```
