---
id: basecamp
title: Basecamp
---

## Documentation

https://github.com/basecamp/api/blob/master/sections/authentication.md

## Configuration

https://launchpad.37signals.com/integrations

## Options

The **Basecamp Provider** comes with a set of default options:

- [Basecamp Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/basecamp.js)

You can override any of the options to suit your own use case.

## Examples

### Basic profile information

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Basecamp({
    clientId: process.env.BASECAMP_CLIENT_ID,
    clientSecret: process.env.BASECAMP_CLIENT_SECRET
  })
]
...
```

:::note
Using the example above, it is only possible to retrieve profile information such as account id, email and name. If you wish to retrieve user data in relation to a specific team, you must provide a different profileUrl and a custom function to handle profile information as shown in the example below.
:::

### Profile information in relation to specific team

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Basecamp({
    clientId: process.env.BASECAMP_CLIENT_ID,
    clientSecret: process.env.BASECAMP_CLIENT_SECRET,
    profileUrl: `https://3.basecampapi.com/${process.env.BASECAMP_TEAM_ID}/my/profile.json`,
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email_address,
        image: profile.avatar_url,
        admin: profile.admin,
        owner: profile.owner
      }
    }
  })
]
...
```

:::tip
The BASECAMP_TEAM_ID is found in the url path of your team's homepage. For example, if the url is `https://3.basecamp.com/1234567/projects`, then in this case the BASECAMP_TEAM_ID is 1234567
:::
