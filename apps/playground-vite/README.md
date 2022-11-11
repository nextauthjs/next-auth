# NextAuth + Vite Playground

NextAuth.js is committed to bringing easy authentication to other frameworks. [#2294](https://github.com/nextauthjs/next-auth/issues/2294)

This is an example application that shows how next-auth is applied to a Vite app (vite-plugin-ssr)[https://vite-plugin-ssr.com/].

Demo: https://vite-ssr-next-auth.vercel.app

## Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Configure your local environment

Copy the .env.example file in this directory to .env (which will be ignored by Git):

```
cp .env.example .env
```

Add details for one or more providers (e.g. Google, Twitter, GitHub, Email, etc).

### 3. Configure Authentication Providers

1. Review and update options in `server/handler.ts` as needed.

2. When setting up OAuth, in the developer admin page for each of your OAuth services, you should configure the callback URL to use a callback path of `{server}/api/auth/callback/{provider}`.

  e.g. For Google OAuth you would use: `http://localhost:3000/api/auth/callback/google`

  A list of configured providers and their callback URLs is available from the endpoint `/api/auth/providers`. You can find more information at https://next-auth.js.org/configuration/providers/oauth

3. You can also choose to specify an SMTP server for passwordless sign in via email.

### 4. Start the application

To run your site locally, use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

### 5. Preparing for Production

Follow the [Deployment documentation](https://vite-plugin-ssr.com/vercel) for vite-plugin-ssr.
