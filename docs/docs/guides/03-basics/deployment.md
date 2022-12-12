# Deployment

Deploying NextAuth.js only requires a few steps. It can be run anywhere a Next.js application can. Therefore, in a default configuration using only JWT session strategy, i.e. without a database, you will only need these few things in addition to your application:

1. NextAuth.js environment variables

   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

2. NextAuth.js API Route and its configuration (`/pages/api/auth/[...nextauth].js`).
   - OAuth Provider `clientId` / `clientSecret`

Deploying a modern JavaScript application using NextAuth.js consists of making sure your environment variables are set correctly as well as the configuration in the NextAuth.js API route is setup, as well as any configuration (like Callback URLs, etc.) are correctly done in your OAuth provider(s) themselves.

See below for more detailed provider settings.

## Vercel

1. Make sure to expose the Vercel [System Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables) in your project settings.
2. Create a `NEXTAUTH_SECRET` environment variable for all environments.
   a. You can use `openssl rand -base64 32` or https://generate-secret.vercel.app/32 to generate a random value.
   b. You **do not** need the `NEXTAUTH_URL` environment variable in Vercel.
3. Add your provider's client ID and client secret to environment variables. _(Skip this step if not using an [OAuth Provider](/configuration/providers/oauth))_
4. Deploy!

Example repository: https://github.com/nextauthjs/next-auth-example

A few notes about deploying to Vercel. The environment variables are read server-side, so you do not need to prefix them with `NEXT_PUBLIC_`. When deploying here, you do not need to explicitly set the `NEXTAUTH_URL` environment variable. With other providers **you will** need to also set this environment variable.

### Securing a preview deployment

Securing a preview deployment (with an OAuth provider) comes with some critical obstacles. Most OAuth providers only allow a single redirect/callback URL, or at least a set of full static URLs. Meaning you cannot set the value before publishing the site and you cannot use wildcard subdomains in the callback URL settings of your OAuth provider. Here are a few ways you can still use NextAuth.js to secure your Preview Deployments.

#### Using the Credentials Provider

You could check in your `/pages/api/auth/[...nextauth].js` API route / configuration file to see if you're currently in a Vercel preview environment, and if so, enable a simple "credential provider", meaning username/password. Vercel offers a few built-in [system environment variables](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables) which you could check against, like `VERCEL_ENV`. This would allow you to use this basic, for testing only, authentication strategy in your preview deployments.

Some things to be aware of here, include:

- Do not let this potential testing-only user have access to any critical data
- If possible, maybe do not even connect this preview deployment to your production database

##### Example

```js title="/pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
              placeholder: "jsmith",
            },
            password: { label: "Password", type: "password" },
          },
          async authorize() {
            return {
              id: 1,
              name: "J Smith",
              email: "jsmith@example.com",
              image: "https://i.pravatar.cc/150?u=jsmith@example.com",
            }
          },
        })
      : GoogleProvider({
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET,
        }),
  ],
})
```

#### Using the branch based preview URL

Preview deployments at Vercel are often available via multiple URLs. For example, PR's merged to `master` or `main`, will be available the commit and PR specific preview URLs, but also the branch specific preview URLs. This branch specific URL will obviously not change as long as you work with that same branch. Therefore, you could add to your OAuth provider your `{project}-git-main-{user}.vercel.app` preview URL. As this will stay constant for that branch, you can reuse that preview deployment / URL for testing any authentication related deployments.

## Netlify

Netlify is very similar to Vercel in that you can deploy a Next.js project without almost any extra work.

In order to setup NextAuth.js correctly here, you will want to make sure you add your `NEXTAUTH_SECRET` environment variable in the project settings. If you are using the [Essential Next.js Build Plugin](https://github.com/netlify/netlify-plugin-nextjs) within your project, you **do not** need to set the `NEXTAUTH_URL` environment variable as it is set automatically as part of the build process. 

Netlify also exposes some [system environment variables](https://docs.netlify.com/configure-builds/environment-variables/) from which you can check which `NODE_ENV` you are currently in and much more.

After this, just make sure you either have your OAuth provider setup correctly with `clientId` / `clientSecret`'s and callback URLs.
