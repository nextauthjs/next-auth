---
id: email
title: Email
---

## Overview

The Email provider uses email to send "magic links" that can be used to sign in, you will likely have seen these if you have used services like Slack before.

Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted).

The Email provider can be used in conjunction with (or instead of) one or more OAuth providers.

### How it works

On initial sign in, a **Verification Token** is sent to the email address provided. By default this token is valid for 24 hours. If the Verification Token is used within that time (i.e. by clicking on the link in the email) an account is created for the user and they are signed in.

If someone provides the email address of an _existing account_ when signing in, an email is sent and they are signed into the account associated with that email address when they follow the link in the email.

:::tip
The Email Provider can be used with both JSON Web Tokens and database sessions, but you **must** configure a database to use it. It is not possible to enable email sign in without using a database.
:::

## Options

The **Email Provider** comes with a set of default options:

- [Email Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/email.ts)

You can override any of the options to suit your own use case.

## Configuration

1. NextAuth.js does not include `nodemailer` as a dependency, so you'll need to install it yourself if you want to use the Email Provider. Run `npm install nodemailer` or `yarn add nodemailer`.
2. You will need an SMTP account; ideally for one of the [services known to work with `nodemailer`](http://nodemailer.com/smtp/well-known/).
3. There are two ways to configure the SMTP server connection.

You can either use a connection string or a `nodemailer` configuration object.

2.1 **Using a connection string**

Create an `.env` file to the root of your project and add the connection string and email address.

```js title=".env" {1}
	EMAIL_SERVER=smtp://username:password@smtp.example.com:587
	EMAIL_FROM=noreply@example.com
```

Now you can add the email provider like this:

```js {3} title="pages/api/auth/[...nextauth].js"
import EmailProvider from "next-auth/providers/email";
...
providers: [
  EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM
  }),
],
```

2.2 **Using a configuration object**

In your `.env` file in the root of your project simply add the configuration object options individually:

```js title=".env"
EMAIL_SERVER_USER=username
EMAIL_SERVER_PASSWORD=password
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@example.com
```

Now you can add the provider settings to the NextAuth options object in the Email Provider.

```js title="pages/api/auth/[...nextauth].js"
import EmailProvider from "next-auth/providers/email";
...
providers: [
  EmailProvider({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    },
    from: process.env.EMAIL_FROM
  }),
],
```

3. Do not forget to setup one of the database [adapters](/adapters/overview) for storing the Email verification token.

4. You can now sign in with an email address at `/api/auth/signin`.

A user account (i.e. an entry in the Users table) will not be created for the user until the first time they verify their email address. If an email address is already associated with an account, the user will be signed in to that account when they use the link in the email.

## Customizing emails

You can fully customize the sign in email that is sent by passing a custom function as the `sendVerificationRequest` option to `EmailProvider()`.

e.g.

```js {3} title="pages/api/auth/[...nextauth].js"
import EmailProvider from "next-auth/providers/email";
...
providers: [
  EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    sendVerificationRequest({
      identifier: email,
      url,
      provider: { server, from },
    }) {
      /* your function */
    },
  }),
]
```

The following code shows the complete source for the built-in `sendVerificationRequest()` method:

```js
import nodemailer from "nodemailer"

async function sendVerificationRequest({
  identifier: email,
  url,
  provider: { server, from },
}) {
  const { host } = new URL(url)
  const transport = nodemailer.createTransport(server)
  await transport.sendMail({
    to: email,
    from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email }),
  })
}

// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

  // Some simple styling options
  const backgroundColor = "#f9f9f9"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#346df1"
  const buttonBorderColor = "#346df1"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Sign in to ${host}\n${url}\n\n`
}
```

:::tip
If you want to generate great looking email client compatible HTML with React, check out https://mjml.io
:::

## Customizing the Verification Token

By default, we are generating a random verification token. You can define a `generateVerificationToken` method in your provider options if you want to override it:

```js title="pages/api/auth/[...nextauth].js"
providers: [
  EmailProvider({
    async generateVerificationToken() {
      return "ABC123"
    }
  })
],
```
