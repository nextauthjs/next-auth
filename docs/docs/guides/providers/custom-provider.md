---
title: OAuth Provider
---

Auth.js comes with a set of built-in OAuth providers that you can import from `@auth/core/providers/*`. Every provider has their separate documentation page under the [core package's API Reference](/reference/core)

## Use your own provider

However, you can use _any_ provider as long as they are compliant with the OAuth/OIDC specifications.

Auth.js uses the [`oauth4webapi`](https://github.com/panva/oauth4webapi/blob/main/docs/README.md) package under the hood.

To use a custom OAuth provider with Auth.js, pass an object to the [`providers` list](/reference/core#providers).

It can implement either the [`OAuth2Config`](/reference/core/providers#oauth2configprofile) or the [`OIDCConfig`](/reference/core/providers#oidcconfigprofile) interface, depending on if your provider is OAuth 2 or OpenID Connect compliant.

For example, if you have a fully OIDC-compliant provider, this is all you need:

```ts
import type { OIDCConfig } from "@auth/core/providers"

...
providers: [
  {
    id: "my-oidc-provider",
    name: "My Provider",
    type: "oidc",
    issuer: "https://my.oidc-provider.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  } satisfies OIDCConfig
]
...
```

Then, you can set the [Redirect URI](https://www.ietf.org/archive/id/draft-ietf-oauth-v2-1-07.html#name-client-redirection-endpoint) in your provider's dashboard to something like `https://app-url.com/{path-to-auth-handler}/callback/my-oidc-provider`.

`{path-to-auth-handler}` is _usually_ `auth` or `api/auth`, depending on your framework of your choice.
`my-oidc-provider` matches the `id` you set in the [`providers` list](/reference/core#providers).

## Override default provider config

For built-in providers, in most cases you will only need to specify the `clientId` and `clientSecret`, and in case of OIDC providers, the `issuer` property. If you need to override any of the defaults, you can add them in the provider's function call and they will be deep-merged with the default configuration options.

:::note
The user provided options are deeply merged with the default options. That means you only have to override part of the options that you need to be different. For example if you want different scopes, overriding `authorization.params.scope` is enough, instead of the whole `authorization` option.
:::

For example, to override a provider's default scopes, you can do the following:

```ts
import Auth0Provider from "@auth/core/providers/auth0"

Auth0Provider({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  issuer: process.env.ISSUER,
  authorization: { params: { scope: "openid your_custom_scope" } },
})
```

Another example, the `profile` callback will return `id`, `name`, `email` and `picture` by default, but you might want to return more information from the provider. After setting the correct scopes, you can then do something like this:

```ts
import GoogleProvider from "@auth/core/providers/google"

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

```ts
import GoogleProvider from "@auth/core/providers/google"

GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
})
```

## Adding a new built-in provider

If you think your custom provider might be useful to others, we encourage you to open a PR and add it to the built-in list.

:::note
We are only accepting new providers to `@auth/core`, and not `next-auth`. Follow the steps below to make sure your PR is merged!
:::

1. Create a new `{provider}.ts` (for it to get merged, you must use TypeScript) file under the [`packages/core/src/providers`](https://github.com/nextauthjs/next-auth/tree/main/packages/core/src/providers) directory.
2. Make sure that you are following other providers, ie.:

- Use a named default export: `export default function YourProvider`
- Export the TypeScript `interface` that defines the provider's available user info properties
- Add the necessary JSDoc comments/documentation (Study the built-in providers to get an understanding what's needed. For example, the [Auth0 provider](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/auth0.ts) is a good example for OIDC and the [GitHub Provider](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts) is an OAuth provider.)
- Add links to the provider's API reference/documentation so others can understand how to use the provider

3. Add the new provider name to the `Provider type` dropdown options in [`the provider issue template`](https://github.com/nextauthjs/next-auth/edit/main/.github/ISSUE_TEMPLATE/2_bug_provider.yml)
4. (Optional): Add a logo `{provider}.svg` to the [`docs/static/img/providers`](https://github.com/nextauthjs/next-auth/tree/main/docs/static/img/providers) directory.

That's it! 🎉 Others will be able to discover and use this provider!
