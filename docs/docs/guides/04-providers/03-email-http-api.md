---
id: email-http
title: HTTP-based Email Provider
---

## Introduction

We have always had a built-in Email provider with which you could connect to the SMTP server of your choice to send "magic link" emails for sign-in purposes. However, the Email provider can also be used with HTTP-based email services, like AWS SES, Postmark, Sendgrid, etc. In this guide we are going to explain how to use our Email magic link provider with any of the more modern HTTP-based Email APIs.

For this example, we will be using [SendGrid](https://sendgrid.com), but any email service providing an HTTP API or JS client library will work.

## Setup

First, if you do not have a project using Auth.js, clone and setup a basic Auth.js project like the the one [provided in our example repo](https://github.com/nextauthjs/next-auth-example.git). We will need to make at least the following modifications to the example repository, or any other project you're adding this to, including:

- Install and configure any [Auth.js Database Adapter](/adapters/overview), as it is a requirement for the Email provider.
- Generate an API key from your cloud Email provider of choice and add it to your `.env.*` file. For example, mine is going to be called `SENDGRID_API`.

At this point, you should have a default `[...nextauth].ts` file which looks something like this:

```ts title="pages/api/auth/[...nextauth].ts"
import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/db"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  // ...
}

export default NextAuth(authOptions)
```

## Customization

This is a standard Auth.js Email provider + Prisma adapter setup. So we will customize a few things in order to avoid using the built-in EmailProvider and its SMTP connectivity to send emails, and instead use a custom provider and the HTTP API endpoint provided to us by our cloud Email provider of choice.

To make this change, first remove the `EmailProvider` you may have in your `providers` array, and add an object with `id`, `type` and `sendVerificationRequest` keys like below:

```js title="pages/api/auth/[...nextauth].ts"
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'sendgrid',
      type: 'email',
      async sendVerificationRequest(params) {
        const { identifier: email, url } = params

        // Coming soon...
      }
    }
  ],
  ...
}
```

Next, all thats left to do is call the HTTP endpoint from our cloud email provider and pass it required metadata like the `to` address, the email `body`, and any other fields we may need to include.

As mentioned earlier, we're going to be using SendGrid in this example, so the appropriate endpoint is `https://api.sendgrid.com/v3/mail/send` ([more info](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)). Therefore, we're going to pull out some of the important information from the `params` argument and use it in a `fetch()` call to the previously mentioned SendGrid API.

```js title="pages/api/auth/[...nextauth].ts"
export const authOptions: NextAuthOptions = {
  ...,
  providers: [
    {
      id: 'sendgrid',
      type: 'email',
      async sendVerificationRequest(params) {
        const { identifier: email, url } = params
        // Call the cloud Email provider API for sending messages
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          // The body format will vary depending on provider, please see their documentation
          // for further details.
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: "noreply@company.com" },
            subject: "Sign in to Your page",
            content: [
              {
                type: "text/plain",
                value: `Please click here to authenticate - ${url}`,
              },
            ],
          }),
          headers: {
            // Authentication will also vary from provider to provider, please see their docs.
            Authorization: `Bearer ${process.env.SENDGRID_API}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        })

        if (!response.ok) {
          const { errors } = await response.json()
          throw new Error(JSON.stringify(errors))
        }
      },
    }
  ],
  ...
}
```

And that's all we need to do to send Emails via an HTTP API! Note here that the example is only using `text/plain` as the body type. You'll probably want to change that to `text/html` and pass in a nice looking HTML email. See, for example, our `html` function in [the Auth.js docs](/providers/email#customizing-emails).

In addition, we're using a custom provider here, but we can refer to it by its `id` as the first argument to the `signIn()` function in any custom signin pages, just like any other provider. So this one would be referred to, for example, in a buttons `onClick` handler like `signIn('sendgrid', { email: 'user@company.com' })`.

## Further Reading

- [Email provider documentation with HTML generation and more](/reference/core/modules/providers_email)
- [SendGrid JSON Body documentation](https://docs.sendgrid.com/api-reference/mail-send/mail-send#body)
