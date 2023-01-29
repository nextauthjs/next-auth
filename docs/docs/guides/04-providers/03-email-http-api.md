---
id: email-http
title: Using HTTP Email APIs with Auth.js
---

## Introduction

We have always provided an Email provider with Auth.js with which you could provide to any SMTP server of your choice to send use "magic link" emails to sign-in with. However, as time went on, we had more and more people as us to make it easy to use HTTP-based Email providers, like AWS SES, Postmark, Sendgrid, etc. This was theoretically always possible, but we didn't make it as straight-forward as possible. In this guide I'm going to explain how to use our Email magic link provider with any of the more modern HTTP-based Email APIs.

For this API I will be using [Sendgrid](https://sendgrid.com), but any Email provider which provides an HTTP API / JS-client library will do the trick.

## Setup 

First, clone and setup a basic Auth.js project like the the one [provided in our example repo](https://github.com/nextauthjs/next-auth-example.git). I won't go into the details of setting up your project for Auth.js's [Email provider](https://next-auth.js.org/providers/email), but you will need to make at least the following modifications to the example repository, or any other project you're adding this support to, including:

  - Install `nodemailer` as a dependency. The email provider also requires the use of a database adapter for Auth.js.
  - Install `@prisma/client` and `@next-auth/prisma-adapter` as dependencies, and `prisma` as a dev dependency and setup Prisma as detailed in [our guide](https://next-auth.js.org/adapters/prisma).
  - Generate an API key from your cloud Email provider of choice and add it to your `.env.*` file. For example, mine is going to be called `SENDGRID_API`.

At this point, you should have a `[...nextauth].ts` file which looks something like this:

```js title="/src/pages/api/auth/[...nextauth].ts"
import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/db"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
  ],
  adapter: PrismaAdapter(prisma),
  theme: {
    colorScheme: "dark",
  },
}

export default NextAuth(authOptions)
```

## Customisation

This is a standard Auth.js Email provider + Prisma adapter setup. At this point, we will customize a few things in order to avoid using the built-in SMTP connectivity to send emails, and instead use the HTTP API endpoint provided to us by our cloud Email provider of choice.

To make this change, first remove any of the existing options inside the object being passed to the `EmailProvider` and add `sendVerificationRequest`, like so:

```js title="/src/pages/api/auth/[...nextauth].ts"
export const authOptions: NextAuthOptions = {
  ...,
  providers: [
    EmailProvider({
      sendVerificationRequest: async (params) => {
        const { identifier: email, url } = params

        // Coming soon...
      }
    })
  ],
  ...
}
```

This method allows us to override the sending behaviour of the email adapter. It was designed exactly for this reason, to be able to override the default `nodemailer` SMTP transport, so you could theoretically use another SMTP library, or send emails via a totally different route, as we are doing here.

So the goal now is to simply call the HTTP endpoint from our cloud email provider to send a message and pass it the `to` address, the email `body`, and any other fields we may want to include.

As mentioned earlier, I'm going to be using Sendgrid in this example, so the endpoint I need to use is `https://api.sendgrid.com/v3/mail/send` ([Docs](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)). Therefore, after pulling out some of the important information from the `params` parameter, I'm going to continue by making a `fetch()` call to the previously mentioned API endpoint.

```js title="/src/pages/api/auth/[...nextauth].ts"
export const authOptions: NextAuthOptions = {
  ...,
  providers: [
    EmailProvider({
      // Write our own send request method
      sendVerificationRequest: async (params) => {
        // Destructure and rename only the variables we need from 'params'
        const { identifier: email, url } = params

        try {
          // Finally, call the cloud Email provider API for sending messages
          const sendResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
            // The body format will vary depending on provider, please see their documentation
            // for further details.
            body: JSON.stringify({
              "personalizations": [
                {
                  "to": [
                    {
                      "email": email
                    }
                  ]
                }
              ],
              "from": {
                "email": "noreply@company.com"
              },
              "subject": "Auth.js Magic Link",
              "content": [
                {
                  "type": "text/plain",
                  "value": `Please click here to authenticate - ${url}`
                }
              ]
            }),
            headers: {
              // Authentication will also vary from provider to provider, please see their docs.
              Authorization: `Bearer ${process.env.SENDGRID_API}`,
              "Content-Type": "application/json"
            },
            method: "POST"
          })

          if (!res.ok) {
            const responseJson = await sendResponse.json()
            throw new Error(JSON.stringify(responseJson.errors))
          }
        } catch (e) {
          console.error('Could not send Email', e)
        }
      }
    })
  ],
  ...
}
```

## Further Reading

1. Auth.js Email provider documentation with example HTML generation function and more - https://next-auth.js.org/providers/email
2. SendGrid JSON Body documentation - https://docs.sendgrid.com/api-reference/mail-send/mail-send#body
