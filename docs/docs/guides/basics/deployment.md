---
title: Deployment
---

Deploying Auth.js only requires a few steps. It can be run anywhere a Next.js application can. Therefore, in a default configuration using only JWT session strategy, i.e. without a database, you will only need these few things in addition to your application:

1. Auth.js environment variables

   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

2. Auth.js API Route and its configuration (`/pages/api/auth/[...nextauth].js`).
   - OAuth Provider `clientId` / `clientSecret`

Deploying a modern JavaScript application using Auth.js consists of making sure your environment variables are set correctly as well as the configuration in the Auth.js API route is setup, as well as any configuration (like Callback URLs, etc.) are correctly done in your OAuth provider(s) themselves.

See below for more detailed provider settings.

## Vercel

1. Make sure to expose the Vercel [System Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables) in your project settings. This way, we can detect the environment. (Setting `NEXTAUTH_URL` environment variable on Vercel is **unnecessary**).
2. Create a `NEXTAUTH_SECRET` environment variable for both Production and Preview environments.
   a. You can use `openssl rand -base64 32` or https://generate-secret.vercel.app/32 to generate a random value.
3. Add your provider's client ID and client secret to environment variables. _(Skip this step if not using an [OAuth Provider](/reference/providers/index))_
4. Deploy!

Example repository: https://github.com/nextauthjs/next-auth-example

A few notes about deploying to Vercel. The environment variables are read server-side, so you **should not** prefix them with `NEXT_PUBLIC_` to avoid accidentally bundling a secret in the client-side JavaScript code.

### Securing a preview deployment

Most OAuth providers cannot be configured with multiple callback URLs or using a wildcard. 

However, Auth.js **supports Preview deployments**, even **with OAuth providers**:

1. Determine a stable deployment URL. Eg.: A deployment whose URL does not change between builds, for example. `auth.yourdomain.com`),
2. Set `AUTH_REDIRECT_PROXY_URL` to that URL, adding the path up until your `[...nextauth]` route. Eg.: (`https://auth.yourdomain.com/api/auth`)
3. For your OAuth provider, set the callback URL using the stable deployment URL. Eg.: For GitHub `https://auth.yourdomain.com/api/auth/callback/github`)

:::info
To support preview deployments, the `AUTH_SECRET` value needs to be the same for the stable deployment and deployments that will need OAuth support.
:::


<details>
<summary>
<b>How does this work?</b>
</summary>
To support preview deployments, Auth.js uses the stable deployment URL as a redirect proxy server.

It will redirect the OAuth callback request to the preview deployment URL, but only when the `AUTH_REDIRECT_PROXY_URL` environment variable is set. The stable deployment can still act as a regular app.

When a user initiates an OAuth sign-in flow on a preview deployment, we save its URL in the `state` query parameter but set the `redirect_uri` to the stable deployment.

Then, the OAuth provider will redirect the user to the stable deployment, which then will verify the `state` parameter and redirect the user to the preview deployment URL if the `state` is valid. This is secured by relying on the same server-side `AUTH_SECRET` for the stable deployment and the preview deployment.

See also:
<ul>
<li><a href="https://www.ietf.org/rfc/rfc6749.html#section-4.1.1">OAuth 2.0 specification: `state` query parameter</a></li>
</ul>
</details>

## Netlify

Netlify is very similar to Vercel in that you can deploy a Next.js project without almost any extra work.

To set up Auth.js correctly here, you will want to make sure you add your `NEXTAUTH_SECRET` environment variable in the project settings. If you are using the [Essential Next.js Build Plugin](https://github.com/netlify/netlify-plugin-nextjs) within your project, you **do not** need to set the `NEXTAUTH_URL` environment variable as it is set automatically as part of the build process.

Netlify also exposes some [system environment variables](https://docs.netlify.com/configure-builds/environment-variables/) from which you can check which `NODE_ENV` you are currently in and much more.

After this, make sure you either have your OAuth provider set up correctly with `clientId` / `clientSecret`'s and callback URLs.
