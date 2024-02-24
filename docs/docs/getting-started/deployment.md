---
title: Deployment
---

Auth.js relies strictly on standard Web APIs, so it can be deployed anywhere you can deploy a JavaScript application. Auth.js is fully compatible with Edge runtimes too.

By default, it uses the [JWT session strategy](/concepts/session-strategies#jwt) so it does not require a database to be configured.

## Environment Variables

:::tip
For consistency, we recommend prefixing all Auth.js environment variables with `AUTH_`. This way, we can autodetect and distinguish them from other environment variables.
:::

Auth.js libraries require you to set an `AUTH_SECRET` environment variable. This is used to encrypt cookies and tokens. It should be a random string of at least 32 characters. On Linux systems, you can generate a suitable string using the command `openssl rand -base64 32`. You can also use a tool like [generate-secret.vercel.app](https://generate-secret.vercel.app/32) to generate a random value.

If you are using an [OAuth Provider](/getting-started/providers), your provider will have a `clientId` and `clientSecret` that you will need to set as environment variables as well. In the case of OIDC, a third `issuer` option is required.

:::info
Some Auth.js libraries can infer environment variables without passing them explicitly. For example, the Next.js library can infer the `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` environment variables as the `clientId` and `clientSecret` options for the GitHub provider. See the API reference for your framework to learn more about this feature.
:::

## Serverless

Hosting services like Vercel and Netlify are great for deploying Auth.js apps. The following steps should help you get started:

1. Create the required [environment variables](#environment-variables) for the desired deploy environments.
2. In the case of an OAuth provider, set the callback URL for the provider to `https://yourdomain.com/api/auth/callback/provider` (replace `yourdomain.com` with your domain and `provider` with the provider name, eg.: `github`).
3. Deploy!

## Self-hosted

Auth.js can also be deployed anywhere you can deploy the framework of your choice. Check out the framework's documentation on self-hosting.

## Securing a preview deployment

Most OAuth providers cannot be configured with multiple callback URLs or using a wildcard.

However, Auth.js **supports Preview deployments**, even **with OAuth providers**:

1. Determine a stable deployment URL. Eg.: A deployment whose URL does not change between builds, for example. `auth.yourdomain.com` (using a subdomain is not a requirement, this can be the main site's URL too, for example.)
2. Set `AUTH_REDIRECT_PROXY_URL` to that stable deployment URL, including the path from where Auth.js handles the routes. Eg.: (`https://auth.yourdomain.com/api/auth`)
3. For your OAuth provider, set the callback URL using the stable deployment URL. Eg.: For GitHub `https://auth.yourdomain.com/api/auth/callback/github`)

:::note
To support preview deployments, the `AUTH_SECRET` value needs to be the same for the stable deployment and deployments that will need OAuth support.
:::

:::note
If you are storing users in a [database](/reference/core/adapters), we recommend using a different OAuth app for development/production so that you don't mix your test and production user base.
:::

<details>
<summary>
<b>How does this work?</b>
</summary>
To support preview deployments, Auth.js uses the stable deployment URL as a redirect proxy server.

It will redirect the OAuth callback request to the preview deployment URL, but only when the `AUTH_REDIRECT_PROXY_URL` environment variable is set. The stable deployment can still act as a regular app.

When a user initiates an OAuth sign-in flow on a preview deployment, we save its URL in the `state` query parameter but set the `redirect_uri` to the stable deployment.

Then, the OAuth provider will redirect the user to the stable deployment, which will verify the `state` parameter and redirect the user to the preview deployment URL if the `state` is valid. This is secured by relying on the same server-side `AUTH_SECRET` for the stable deployment and the preview deployment.

See also:

<ul>
<li><a href="https://www.ietf.org/rfc/rfc6749.html#section-4.1.1">OAuth 2.0 specification: `state` query parameter</a></li>
</ul>
</details>
