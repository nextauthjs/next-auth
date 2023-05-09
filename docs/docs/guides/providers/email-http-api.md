---
id: email-http
title: HTTP-based Email Provider
---

## Introduction

:::note
The following guide is written for `next-auth` (NextAuth.js), but it should work for any of the Auth.js framework libraries (`@auth/*`) as well.
:::


There is a built-in Email provider with which you could connect to the SMTP server of your choice to send "magic link" emails for sign-in purposes. However, the Email provider can also be used with HTTP-based email services, like AWS SES, Postmark, Sendgrid, etc. In this guide, we are going to explain how to use our Email magic link provider with any of the more modern HTTP-based Email APIs.

For this example, we will be using [SendGrid](https://sendgrid.com), but any email service providing an HTTP API or JS client library will work.
We will also refer to the [Prisma Adapter](/reference/adapter/prisma). A [database adapter](/adapters/overview) is a requirement for the Email provider.

## Setup

First, if you do not have a project using Auth.js, clone and set up a basic Auth.js project like the one [provided in](https://github.com/nextauthjs/next-auth-example.git) our example repo](https://github.com/nextauthjs/next-auth-example.git).

- Install the [Prisma Adapter](/reference/adapter/prisma)
- Generate an API key from your cloud Email provider of choice and add it to your `.env.*` file. For example, mine is going to be called `SENDGRID_API`
- Add the following configuration to your configuration file:

```js title="pages/api/auth/[...nextauth].ts"
import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'sendgrid',
      type: 'email',
      async sendVerificationRequest({identifier: email, url}) {
      }
    }
  ],
}

export default NextAuth(authOptions)
```

Next, all that's left to do is call the HTTP endpoint from our cloud email provider and pass it the required metadata like the `to` address, the email `body`, and any other fields we may need to include.

As mentioned earlier, we're going to be using SendGrid in this example, so the appropriate endpoint is `https://api.sendgrid.com/v3/mail/send` ([more info](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)). Therefore, we're going to pull out some of the important information from the `params` argument and use it in a `fetch()` call to the previously mentioned SendGrid API.

```js title="pages/api/auth/[...nextauth].ts"
import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'sendgrid',
      type: 'email',
      async sendVerificationRequest({identifier: email, url}) {
        // highlight-start
        // Call the cloud Email provider API for sending emails
        // See https://docs.sendgrid.com/api-reference/mail-send/mail-send
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
        // highlight-end
      },
    }
  ],
}
```

And that's all we need to do to send Emails via an HTTP API! Note here that the example is only using `text/plain` as the body type. You'll probably want to change that to `text/html` and pass in a nice-looking HTML email. See, for example, our `html` function in [the Auth.js docs](/providers/email#customizing-emails).

To sign in via this custom provider, you would refer to it by the `id` in when you are calling the sign-in method, for example: `signIn('sendgrid', { email: 'user@company.com' })`.

## References

- [Email provider documentation with HTML generation and more](/reference/core/modules/providers_email)
- [SendGrid JSON Body documentation](https://docs.sendgrid.com/api-reference/mail-send/mail-send#body)
