---
title: OAuth Provider Options
sidebar_label: Custom OAuth provider
---

## Summary

Whenever you configure a custom or a built-in OAuth provider, you have the following options available:

```ts
interface OAuthConfig {
  /**
   * OpenID Connect (OIDC) compliant providers can configure
   * this instead of `authorize`/`token`/`userinfo` options
   * without further configuration needed in most cases.
   * You can still use the `authorize`/`token`/`userinfo`
   * options for advanced control.
   *
   * [Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414#section-3)
   */
  wellKnown?: string
  /**
   * The login process will be initiated by sending the user to this URL.
   *
   * [Authorization endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1)
   */
  authorization: EndpointHandler<AuthorizationParameters>
  /**
   * Endpoint that returns OAuth 2/OIDC tokens and information about them.
   * This includes `access_token`, `id_token`, `refresh_token`, etc.
   *
   * [Token endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.2)
   */
  token: EndpointHandler<
    UrlParams,
    {
      /**
       * Parameters extracted from the request to the `/api/auth/callback/:providerId` endpoint.
       * Contains params like `state`.
       */
      params: CallbackParamsType
      /**
       * When using this custom flow, make sure to do all the necessary security checks.
       * This object contains parameters you have to match against the request to make sure it is valid.
       */
      checks: OAuthChecks
    },
    { tokens: TokenSet }
  >
  /**
   * When using an OAuth 2 provider, the user information must be requested
   * through an additional request from the userinfo endpoint.
   *
   * [Userinfo endpoint](https://www.oauth.com/oauth2-servers/signing-in-with-google/verifying-the-user-info)
   */
  userinfo?: EndpointHandler<UrlParams, { tokens: TokenSet }, Profile>
  type: "oauth"
  /**
   * Used in URLs to refer to a certain provider.
   * @example /api/auth/callback/twitter // where the `id` is "twitter"
   */
  id: string
  version: string
  profile(profile: P, tokens: TokenSet): Awaitable<User & { id: string }>
  checks?: ChecksType | ChecksType[]
  clientId: string
  clientSecret: string
  /**
   * If set to `true`, the user information will be extracted
   * from the `id_token` claims, instead of
   * making a request to the `userinfo` endpoint.
   *
   * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
   *
   * [`id_token` explanation](https://www.oauth.com/oauth2-servers/openid-connect/id-tokens)
   */
  idToken?: boolean
  region?: string
  issuer?: string
  client?: Partial<ClientMetadata>
  allowDangerousEmailAccountLinking?: boolean
  /**
   * Object containing the settings for the styling of the providers sign-in buttons
   */
  style: ProviderStyleType
}
```

### `authorization` option

Configure how to construct the request to the [_Authorization endpoint_](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1).

There are two ways to use this option:

1. You can either set `authorization` to be a full URL, like `"https://example.com/oauth/authorization?scope=email"`.
2. Use an object with `url` and `params` like so
   ```js
   authorization: {
     url: "https://example.com/oauth/authorization",
     params: { scope: "email" }
   }
   ```

:::tip
If your Provider is OpenID Connect (OIDC) compliant, we recommend using the `wellKnown` option instead.
:::

### `token` option

Configure how to construct the request to the [_Token endpoint_](https://datatracker.ietf.org/doc/html/rfc6749#section-3.2).

There are three ways to use this option:

1. You can either set `token` to be a full URL, like `"https://example.com/oauth/token?some=param"`.
2. Use an object with `url` and `params` like so
   ```js
   token: {
     url: "https://example.com/oauth/token",
     params: { some: "param" }
   }
   ```
3. Completely take control of the request:
   ```js
   token: {
     url: "https://example.com/oauth/token",
     async request(context) {
       // context contains useful properties to help you make the request.
       const tokens = await makeTokenRequest(context)
       return { tokens }
     }
   }
   ```

:::warning
Option 3. should not be necessary in most cases, but if your provider does not follow the spec, or you have some very unique constraints it can be useful. Try to avoid it, if possible.
:::

:::tip
If your Provider is OpenID Connect (OIDC) compliant, we recommend using the `wellKnown` option instead.
:::

### `userinfo` option

A `userinfo` endpoint returns information about the logged-in user. It is not part of the OAuth specification, but usually available for most providers.

There are three ways to use this option:

1. You can either set `userinfo` to be a full URL, like `"https://example.com/oauth/userinfo?some=param"`.
2. Use an object with `url` and `params` like so
   ```js
   userinfo: {
     url: "https://example.com/oauth/userinfo",
     params: { some: "param" }
   }
   ```
3. Completely take control of the request:
   ```js
   userinfo: {
     url: "https://example.com/oauth/userinfo",
     // The result of this method will be the input to the `profile` callback.
     async request(context) {
       // context contains useful properties to help you make the request.
       return await makeUserinfoRequest(context)
     }
   }
   ```

:::warning
Option 3. should not be necessary in most cases, but if your provider does not follow the spec, or you have some very unique constraints it can be useful. Try to avoid it, if possible.
:::

:::tip
In the rare case you don't care about what this endpoint returns, or your provider does not have one, you could create a noop function:

```js
userinfo: {
  request: () => {}
}
```

:::

:::tip
If your Provider is OpenID Connect (OIDC) compliant, we recommend using the `wellKnown` option instead. OIDC usually returns an `id_token` from the `token` endpoint. `next-auth` can decode the `id_token` to get the user information, instead of making an additional request to the `userinfo` endpoint. Just set `idToken: true` at the top-level of your provider configuration. If not set, `next-auth` will still try to contact this endpoint.
:::

### `client` option

An advanced option, hopefully you won't need it in most cases. `next-auth` uses `openid-client` under the hood, see the docs on this option [here](https://github.com/panva/node-openid-client/blob/main/docs/README.md#new-clientmetadata-jwks-options).

### `allowDangerousEmailAccountLinking` option

Normally, when you sign in with an OAuth provider and another account with the same email address already exists, the accounts are not linked automatically. Automatic account linking on sign in is not secure between arbitrary providers and is disabled by default (see our [Security FAQ](https://next-auth.js.org/faq#security)). However, it may be desirable to allow automatic account linking if you trust that the provider involved has securely verified the email address associated with the account. Just set `allowDangerousEmailAccountLinking: true` in your provider configuration to enable automatic account linking.

## Using a custom provider

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
