---
id: email
title: Email
---

## Overview

The Email provider uses email to send "magic links" that can be used sign in, you will likely have seen these if you have used services like Slack before.

Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted).

The Email provider can be used in conjunction with (or instead of) one or more OAuth providers.

### How it works

On initial sign in, a **Verification Token** is sent to the email address provided. By default this token is valid for 24 hours. If the Verification Token is used with that time (i.e. by clicking on the link in the email) an account is created for the user and they are signed in.

If someone provides the email address of an *existing account* when signin in, an email is sent and they are signed into the account associated with that email address when they follow the link in the email.


:::tip
The Email Provider can be used with both JSON Web Tokens and database sessions, but you **must** configure a database to use it. It is not possible to enable email sign in without using a database.
:::

## Configuration

1. You will need an SMTP account; ideally for one of the [services known to work with nodemailer](http://nodemailer.com/smtp/well-known/).
2. There are two ways to configure the SMTP server connection.

  You can either use a connection string or a nodemailer configuration object.

  2.1 **Using a connection string**

  Create an .env file to the root of your project and add the connection string and email address.
  ```js title=".env" {1}
	EMAIL_SERVER=smtp://username:password@smtp.example.com:587
	EMAIL_FROM=noreply@example.com
  ```

  Now you can add the email provider like this:

  ```js {3} title="/pages/api/auth/[...nextauth].js"
  providers: [
    Providers.Email({
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

  ```js title="/pages/api/auth/[...nextauth].js"
  providers: [
    Providers.Email({
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
3. You can now sign in with an email address at `/api/auth/signin`.

  An account will not be created for the user until the first time they verify their email address. If an email address already associated with an account, the user will be signed in to that account when they use the link in the email.

## Customising emails

You can fully customise the sign in email that is sent by passing a custom function as the `sendVerificationRequest` option to `Providers.Email()`.

The following example shows the complete source for the built-in `sendVerificationRequest()` method.

```js
import nodemailer from 'nodemailer'
const sendVerificationRequest = ({ identifier: emailAddress, url, token, site, provider }) => {
  return new Promise((resolve, reject) => {
    const { server, from } = provider
    const siteName = site.replace(/^https?:\/\//, '')

    nodemailer
      .createTransport(server)
      .sendMail({
        to: emailAddress,
        from,
        subject: `Sign in to ${siteName}`,
        text: text({ url, siteName }),
        html: html({ url, siteName })
      }, (error) => {
        if (error) {
          console.error('SEND_VERIFICATION_EMAIL_ERROR', emailAddress, error)
          return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR', error))
        }
        return resolve()
      })
  })
}

// Email HTML body
const html = ({ url, siteName }) => {
  const buttonBackgroundColor = '#444444'
  const buttonTextColor = '#ffffff'
  return `
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" style="padding: 8px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #888888;">
       ${siteName}
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 16px 0;">
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="border-radius: 3px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 3px; padding: 12px 18px; border: 1px solid ${buttonBackgroundColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const text = ({ url, siteName }) => `Sign in to ${siteName}\n${url}\n\n`
```

:::tip
If you want to generate email-client compatible HTML from React, check out https://mjml.io
:::
