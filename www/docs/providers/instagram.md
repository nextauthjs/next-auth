---
id: instagram
title: Instagram
---

## Documentation

https://developers.facebook.com/docs/instagram-basic-display-api/getting-started

## Configuration

https://developers.facebook.com/apps/

## Example

```jsx
// pages/api/auth/[...nextauth].js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Instagram({
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
  })
]
...
// pages/index.jsx
import { signIn } from "next-auth/client"
...
<button onClick={() => signIn("instagram")}>
  Sign in
</button>
...
```

:::warning
Email address is not returned by the Instagram API.
:::

:::tip
Instagram display app required callback URL to be configured in your Facebook app and Facebook required you to use **https** even for localhost! In order to do that, you either need to [add an SSL to your localhost](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/) or use a proxy such as [ngrock](https://ngrok.com/docs).
:::