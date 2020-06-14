---
id: mixer
title: Mixer
---

## API Documentation

https://dev.mixer.com/reference/oauth

## App Configuration

https://mixer.com/lab/oauth

## Usage

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
