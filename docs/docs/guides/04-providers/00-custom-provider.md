---
title: Using a custom Provider
sidebar_label: Creating a Provider
---

You can use an OAuth provider that isn't built-in by using a custom object.

As an example of what this looks like, this is the provider object returned for the Google provider:

```js
{
  id: "google",
  name: "Google",
  type: "oauth",
  wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
  authorization: { params: { scope: "openid email profile" } },
  idToken: true,
  checks: ["pkce", "state"],
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    }
  },
}
```

As you can see, if your provider supports OpenID Connect and the `/.well-known/openid-configuration` endpoint contains support for the `grant_type`: `authorization_code`, you only need to pass the URL to that configuration file and define some basic fields like `name` and `type`.

Otherwise, you can pass a more full set of URLs for each OAuth2.0 flow step, for example:

```js
{
  id: "kakao",
  name: "Kakao",
  type: "oauth",
  authorization: "https://kauth.kakao.com/oauth/authorize",
  token: "https://kauth.kakao.com/oauth/token",
  userinfo: "https://kapi.kakao.com/v2/user/me",
  profile(profile) {
    return {
      id: profile.id,
      name: profile.kakao_account?.profile.nickname,
      email: profile.kakao_account?.email,
      image: profile.kakao_account?.profile.profile_image_url,
    }
  },
}
```

Replace all the options in this JSON object with the ones from your custom provider - be sure to give it a unique ID and specify the required URLs, and finally add it to the providers array when initializing the library:

```js title="pages/api/auth/[...nextauth].js"
import TwitterProvider from "next-auth/providers/twitter"
...
providers: [
  TwitterProvider({
    clientId: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET,
  }),
  {
    id: 'customProvider',
    name: 'CustomProvider',
    type: 'oauth',
    scope: ''  // Make sure to request the users email address
    ...
  }
]
...
```

### Override default options

For built-in providers, in most cases you will only need to specify the `clientId` and `clientSecret`. If you need to override any of the defaults, add your own [options](#options).

Even if you are using a built-in provider, you can override any of these options to tweak the default configuration.

:::note
The user provided options are deeply merged with the default options. That means you only have to override part of the options that you need to be different. For example if you want different scopes, overriding `authorization.params.scope` is enough, instead of the whole `authorization` option.
:::

```js title=/api/auth/[...nextauth].js
import Auth0Provider from "next-auth/providers/auth0"

Auth0Provider({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  issuer: process.env.ISSUER,
  authorization: { params: { scope: "openid your_custom_scope" } },
})
```

Another example, the `profile` callback will return `id`, `name`, `email` and `picture` by default, but you might need more information from the provider. After setting the correct scopes, you can then do something like this:

```js title=/api/auth/[...nextauth].js
import GoogleProvider from "next-auth/providers/google"

GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  profile(profile) {
    return {
      // Return all the profile information you need.
      // The only truly required field is `id`
      // to be able identify the account when added to a database
    }
  },
})
```

An example of how to enable automatic account linking:

```js title=/api/auth/[...nextauth].js
import GoogleProvider from "next-auth/providers/google"
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
})
```

### Adding a new built-in provider

If you think your custom provider might be useful to others, we encourage you to open a PR and add it to the built-in list so others can discover it much more easily!

You only need to add three changes:

1. Add your config: [`src/providers/{provider}.ts`](https://github.com/nextauthjs/next-auth/tree/main/packages/next-auth/src/providers)<br />
   - Make sure you use a named default export, like this: `export default function YourProvider`
   - Add two SVG's of the provider logo, like `google-dark.svg` (dark mode) and `google.svg` (light mode), to the `/packages/next-auth/provider-logos/` directory as well as the styling config to the provider config object. See existing provider for example
2. Add provider documentation: [`/docs/providers/{provider}.md`](https://github.com/nextauthjs/next-auth/tree/main/docs/docs/providers)
3. Add the new provider name to the `Provider type` dropdown options in [`the provider issue template`](https://github.com/nextauthjs/next-auth/edit/main/.github/ISSUE_TEMPLATE/2_bug_provider.yml)

That's it! 🎉 Others will be able to discover and use this provider much more easily now!
