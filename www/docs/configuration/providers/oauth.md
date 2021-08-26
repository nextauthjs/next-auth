---
id: oauth-provider
title: OAuth Provider
---

Authentication Providers in **NextAuth.js** are OAuth definitions which allow your users to sign in with their favorite preexisting logins. You can use any of our many predefined providers, or write your own custom OAuth configuration.

- [Using a built-in OAuth Provider](#oauth-providers) (e.g Github, Twitter, Google, etc...)
- [Using a custom OAuth Provider](#using-a-custom-provider)

:::note
NextAuth.js is designed to work with any OAuth service, it supports **OAuth 1.0**, **1.0A**, **2.0** and **OpenID Connect** and has built-in support for most popular sign-in services.
:::

Without going into too much detail, the OAuth flow generally has 6 parts:

1. The application requests authorization to access service resources from the user
2. If the user authorized the request, the application receives an authorization grant
3. The application requests an access token from the authorization server (API) by presenting authentication of its own identity, and the authorization grant
4. If the application identity is authenticated and the authorization grant is valid, the authorization server (API) issues an access token to the application. Authorization is complete.
5. The application requests the resource from the resource server (API) and presents the access token for authentication
6. If the access token is valid, the resource server (API) serves the resource to the application

<img src="https://i2.wp.com/blogs.innovationm.com/wp-content/uploads/2019/07/blog-open1.png" alt="OAuth Flow Diagram" /><br />
<small>Source: https://dzone.com/articles/open-id-connect-authentication-with-oauth20-author</small>

For more details, check out Aaron Parecki's blog post [OAuth2 Simplified](https://aaronparecki.com/oauth-2-simplified/) or Postman's blog post [OAuth 2.0: Implicit Flow is Dead, Try PKCE Instead](https://blog.postman.com/pkce-oauth-how-to/).

## OAuth Providers

### Available providers

<div className="provider-name-list">
{Object.entries(require("../../../providers.json"))
  .filter(([key]) => !["email", "credentials"].includes(key))
  .sort(([, a], [, b]) => a.localeCompare(b))
  .map(([key, name]) => (
    <span key={key}>
      <a href={`/providers/${key}`}>{name}</a>
      <span className="provider-name-list__comma">,</span>
    </span>
  )
    
)}
</div>

### How to

1. Register your application at the developer portal of your provider. There are usually links to the portals included in the aforementioned documentation pages for each supported provider with details on how to register your application.

2. The redirect URI (sometimes called Callback URL) should follow this format:

```
[origin]/api/auth/callback/[provider]
```

For example, Twitter on `localhost` this would be:

```
http://localhost:3000/api/auth/callback/twitter
```

Using Google in our example application would look like this:

```
https://next-auth-example.vercel.app/api/auth/callback/google
```

3. Create a `.env` file at the root of your project and add the client ID and client secret. For Twitter this would be:

```
TWITTER_ID=YOUR_TWITTER_CLIENT_ID
TWITTER_SECRET=YOUR_TWITTER_CLIENT_SECRET
```

4. Now you can add the provider settings to the NextAuth options object. You can add as many OAuth providers as you like, as you can see `providers` is an array.

```js title="pages/api/auth/[...nextauth].js"
import TwitterProvider from "next-auth/providers/"
...
providers: [
  TwitterProvider({
    clientId: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET
  })
],
...
```

5. Once a provider has been setup, you can sign in at the following URL: `[origin]/api/auth/signin`. This is an unbranded auto-generated page with all the configured providers.

<img src="/img/signin.png" alt="Signin Screenshot" />

### Options

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
       * Thist object contains parameters you have to match against the request to make sure it is valid.
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
  version: string
  accessTokenUrl: string
  requestTokenUrl?: string
  profile(profile: P, tokens: TokenSet): Awaitable<User & { id: string }>
  checks?: ChecksType | ChecksType[]
  clientId: string
  clientSecret:
    | string
    | Record<"appleId" | "teamId" | "privateKey" | "keyId", string>
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
  tenantId?: string
}
```

Even if you are using a built-in provider, you can override any of these options to tweak the default configuration.

```js title=[...nextauth].js
import Auth0Provider from "next-auth/providers/auth0"

Auth0Provider({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  domain: process.env.DOMAIN,
  scope: "openid your_custom_scope", // We do provide a default, but this will override it if defined
  profile(profile) {
    return {} // Return the profile in a shape that is different from the built-in one.
  },
})
```

### Using a custom provider

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

### Adding a new provider

If you think your custom provider might be useful to others, we encourage you to open a PR and add it to the built-in list so others can discover it much more easily!

You only need to add two changes:

1. Add your config: [`src/providers/{provider}.js`](https://github.com/nextauthjs/next-auth/tree/main/src/providers)<br />
   • make sure you use a named default export, like this: `export default function YourProvider`
2. Add provider documentation: [`www/docs/providers/{provider}.md`](https://github.com/nextauthjs/next-auth/tree/main/www/docs/providers)

That's it! 🎉 Others will be able to discover and use this provider much more easily now!
