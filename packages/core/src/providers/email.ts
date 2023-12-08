import type { CommonProviderOptions } from "./index.js"
import type { Awaitable, Theme } from "../types.js"

import { Transport, TransportOptions, createTransport } from "nodemailer"
import * as JSONTransport from "nodemailer/lib/json-transport/index.js"
import * as SendmailTransport from "nodemailer/lib/sendmail-transport/index.js"
import * as SESTransport from "nodemailer/lib/ses-transport/index.js"
import * as SMTPTransport from "nodemailer/lib/smtp-transport/index.js"
import * as SMTPPool from "nodemailer/lib/smtp-pool/index.js"
import * as StreamTransport from "nodemailer/lib/stream-transport/index.js"

// TODO: Make use of https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html for the string
type AllTransportOptions =
  | string
  | SMTPTransport
  | SMTPTransport.Options
  | SMTPPool
  | SMTPPool.Options
  | SendmailTransport
  | SendmailTransport.Options
  | StreamTransport
  | StreamTransport.Options
  | JSONTransport
  | JSONTransport.Options
  | SESTransport
  | SESTransport.Options
  | Transport<any>
  | TransportOptions

export interface SendVerificationRequestParams {
  identifier: string
  url: string
  expires: Date
  provider: EmailConfig
  token: string
  theme: Theme
  request: Request
}

/**
 * The Email Provider needs to be configured with an e-mail client.
 * By default, it uses `nodemailer`, which you have to install if this
 * provider is present.
 *
 * You can use a other services as well, like:
 * - [Postmark](https://postmarkapp.com)
 * - [Mailgun](https://www.mailgun.com)
 * - [SendGrid](https://sendgrid.com)
 * - etc.
 *
 * [Custom email service with Auth.js](https://authjs.dev/guides/providers/email#custom-email-service)
 */
export interface EmailUserConfig extends Record<string, unknown> {
  server?: AllTransportOptions
  type?: "email"
  /** @default `"Auth.js <no-reply@authjs.dev>"` */
  from?: string
  /**
   * How long until the e-mail can be used to log the user in,
   * in seconds. Defaults to 1 day
   *
   * @default 86400
   */
  maxAge?: number
  /** [Documentation](https://authjs.dev/guides/providers/email#customizing-emails) */
  sendVerificationRequest?: (
    params: SendVerificationRequestParams
  ) => Awaitable<void>
  /**
   * By default, we are generating a random verification token.
   * You can make it predictable or modify it as you like with this method.
   *
   * @example
   * ```ts
   *  Providers.Email({
   *    async generateVerificationToken() {
   *      return "ABC123"
   *    }
   *  })
   * ```
   * [Documentation](https://authjs.dev/guides/providers/email#customizing-the-verification-token)
   */
  generateVerificationToken?: () => Awaitable<string>
  /** If defined, it is used to hash the verification token when saving to the database . */
  secret?: string
  /**
   * Normalizes the user input before sending the verification request.
   *
   * ⚠️ Always make sure this method returns a single email address.
   *
   * @note Technically, the part of the email address local mailbox element
   * (everything before the `@` symbol) should be treated as 'case sensitive'
   * according to RFC 2821, but in practice this causes more problems than
   * it solves, e.g.: when looking up users by e-mail from databases.
   * By default, we treat email addresses as all lower case,
   * but you can override this function to change this behavior.
   *
   * [Normalizing the email address](https://authjs.dev/reference/core/providers/email#normalizing-the-email-address) | [RFC 2821](https://tools.ietf.org/html/rfc2821) | [Email syntax](https://en.wikipedia.org/wiki/Email_address#Syntax)
   */
  normalizeIdentifier?: (identifier: string) => string
}

export interface EmailConfig extends CommonProviderOptions {
  // defaults
  id: "email"
  type: "email"
  name: "Email"
  server: AllTransportOptions
  from: string
  maxAge: number
  sendVerificationRequest: (
    params: SendVerificationRequestParams
  ) => Awaitable<void>

  /**
   * This is copied into EmailConfig in parseProviders() don't use elsewhere
   */
  options: EmailUserConfig

  // user options
  // TODO figure out a better way than copying from EmailUserConfig
  secret?: string
  generateVerificationToken?: () => Awaitable<string>
  normalizeIdentifier?: (identifier: string) => string
}

// TODO: Rename to Token provider
// when started working on https://github.com/nextauthjs/next-auth/discussions/1465
export type EmailProviderType = "email"

/**
 * ## Overview
 * The Email provider uses email to send "magic links" that can be used to sign in, you will likely have seen these if you have used services like Slack before.
 *
 * Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted).
 *
 * The Email provider can be used in conjunction with (or instead of) one or more OAuth providers.
 * ### How it works
 *
 * On initial sign in, a **Verification Token** is sent to the email address provided. By default this token is valid for 24 hours. If the Verification Token is used within that time (i.e. by clicking on the link in the email) an account is created for the user and they are signed in.
 *
 *
 * If someone provides the email address of an _existing account_ when signing in, an email is sent and they are signed into the account associated with that email address when they follow the link in the email.
 *
 * :::tip
 * The Email Provider can be used with both JSON Web Tokens and database sessions, but you **must** configure a database to use it. It is not possible to enable email sign in without using a database.
 * :::
 * ## Configuration

 * 1. NextAuth.js does not include `nodemailer` as a dependency, so you'll need to install it yourself if you want to use the Email Provider. Run `npm install nodemailer` or `yarn add nodemailer`.
 * 2. You will need an SMTP account; ideally for one of the [services known to work with `nodemailer`](https://community.nodemailer.com/2-0-0-beta/setup-smtp/well-known-services/).
 * 3. There are two ways to configure the SMTP server connection.
 *
 * You can either use a connection string or a `nodemailer` configuration object.
 *
 * 3.1 **Using a connection string**
 *
 * Create an `.env` file to the root of your project and add the connection string and email address.
 *
 * ```js title=".env" {1}
 * 	EMAIL_SERVER=smtp://username:password@smtp.example.com:587
 * 	EMAIL_FROM=noreply@example.com
 * ```
 *
 * Now you can add the email provider like this:
 *
 * ```js {3} title="pages/api/auth/[...nextauth].js"
 * import EmailProvider from "next-auth/providers/email";
 * ...
 * providers: [
 *   EmailProvider({
 *     server: process.env.EMAIL_SERVER,
 *     from: process.env.EMAIL_FROM
 *   }),
 * ],
 * ```
 *
 * 3.2 **Using a configuration object**
 *
 * In your `.env` file in the root of your project simply add the configuration object options individually:
 *
 * ```js title=".env"
 * EMAIL_SERVER_USER=username
 * EMAIL_SERVER_PASSWORD=password
 * EMAIL_SERVER_HOST=smtp.example.com
 * EMAIL_SERVER_PORT=587
 * EMAIL_FROM=noreply@example.com
 * ```
 *
 * Now you can add the provider settings to the NextAuth.js options object in the Email Provider.
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import EmailProvider from "next-auth/providers/email";
 * ...
 * providers: [
 *   EmailProvider({
 *     server: {
 *       host: process.env.EMAIL_SERVER_HOST,
 *       port: process.env.EMAIL_SERVER_PORT,
 *       auth: {
 *         user: process.env.EMAIL_SERVER_USER,
 *         pass: process.env.EMAIL_SERVER_PASSWORD
 *       }
 *     },
 *     from: process.env.EMAIL_FROM
 *   }),
 * ],
 * ```
 *
 * 4. Do not forget to setup one of the database [adapters](https://authjs.dev/reference/core/adapters) for storing the Email verification token.
 *
 * 5. You can now sign in with an email address at `/api/auth/signin`.
 *
 * A user account (i.e. an entry in the Users table) will not be created for the user until the first time they verify their email address. If an email address is already associated with an account, the user will be signed in to that account when they use the link in the email.
 *
 * ## Customizing emails
 *
 * You can fully customize the sign in email that is sent by passing a custom function as the `sendVerificationRequest` option to `EmailProvider()`.
 *
 * e.g.
 *
 * ```js {3} title="pages/api/auth/[...nextauth].js"
 * import EmailProvider from "next-auth/providers/email";
 * ...
 * providers: [
 *   EmailProvider({
 *     server: process.env.EMAIL_SERVER,
 *     from: process.env.EMAIL_FROM,
 *     sendVerificationRequest({
 *       identifier: email,
 *       url,
 *       provider: { server, from },
 *     }) {
 *       // your function
 *     },
 *   }),
 * ]
 * ```
 *
 * The following code shows the complete source for the built-in `sendVerificationRequest()` method:
 *
 * ```js
 * import { createTransport } from "nodemailer"
 *
 * async function sendVerificationRequest(params) {
 *   const { identifier, url, provider, theme } = params
 *   const { host } = new URL(url)
 *   // NOTE: You are not required to use `nodemailer`, use whatever you want.
 *   const transport = createTransport(provider.server)
 *   const result = await transport.sendMail({
 *     to: identifier,
 *     from: provider.from,
 *     subject: `Sign in to ${host}`,
 *     text: text({ url, host }),
 *     html: html({ url, host, theme }),
 *   })
 *   const failed = result.rejected.concat(result.pending).filter(Boolean)
 *   if (failed.length) {
 *     throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
 *   }
 * }
 *
 * function html(params: { url: string; host: string; theme: Theme }) {
 *   const { url, host, theme } = params
 *
 *   const escapedHost = host.replace(/\./g, "&#8203;.")
 *
 *   const brandColor = theme.brandColor || "#346df1"
 *   const color = {
 *     background: "#f9f9f9",
 *     text: "#444",
 *     mainBackground: "#fff",
 *     buttonBackground: brandColor,
 *     buttonBorder: brandColor,
 *     buttonText: theme.buttonText || "#fff",
 *   }
 *
 *   return `
 * <body style="background: ${color.background};">
 *   <table width="100%" border="0" cellspacing="20" cellpadding="0"
 *     style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
 *     <tr>
 *       <td align="center"
 *         style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
 *         Sign in to <strong>${escapedHost}</strong>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td align="center" style="padding: 20px 0;">
 *         <table border="0" cellspacing="0" cellpadding="0">
 *           <tr>
 *             <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
 *                 target="_blank"
 *                 style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
 *                 in</a></td>
 *           </tr>
 *         </table>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td align="center"
 *         style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
 *         If you did not request this email you can safely ignore it.
 *       </td>
 *     </tr>
 *   </table>
 * </body>
 * `
 * }
 *
 * // Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
 * function text({ url, host }: { url: string; host: string }) {
 *   return `Sign in to ${host}\n${url}\n\n`
 * }
 * ```
 *
 * :::tip
 * If you want to generate great looking email client compatible HTML with React, check out https://mjml.io
 * :::
 *
 * ## Customizing the Verification Token
 *
 * By default, we are generating a random verification token. You can define a `generateVerificationToken` method in your provider options if you want to override it:
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * providers: [
 *   EmailProvider({
 *     async generateVerificationToken() {
 *       return "ABC123"
 *     }
 *   })
 * ],
 * ```
 *
 * ## Normalizing the email address
 *
 * By default, Auth.js will normalize the email address. It treats values as case-insensitive (which is technically not compliant to the [RFC 2821 spec](https://datatracker.ietf.org/doc/html/rfc2821), but in practice this causes more problems than it solves, eg. when looking up users by e-mail from databases.) and also removes any secondary email address that was passed in as a comma-separated list. You can apply your own normalization via the `normalizeIdentifier` method on the `EmailProvider`. The following example shows the default behavior:
 * ```ts
 *   EmailProvider({
 *     // ...
 *     normalizeIdentifier(identifier: string): string {
 *       // Get the first two elements only,
 *       // separated by `@` from user input.
 *       let [local, domain] = identifier.toLowerCase().trim().split("@")
 *       // The part before "@" can contain a ","
 *       // but we remove it on the domain part
 *       domain = domain.split(",")[0]
 *       return `${local}@${domain}`
 *
 *       // You can also throw an error, which will redirect the user
 *       // to the sign-in page with error=EmailSignin in the URL
 *       // if (identifier.split("@").length > 2) {
 *       //   throw new Error("Only one email allowed")
 *       // }
 *     },
 *   })
 * ```
 *
 * :::warning
 * Always make sure this returns a single e-mail address, even if multiple ones were passed in.
 * :::
 */
export default function Email(config: EmailUserConfig): EmailConfig {
  return {
    id: "email",
    type: "email",
    name: "Email",
    server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier, url, provider, theme } = params
      const { host } = new URL(url)
      const transport = createTransport(provider.server)
      const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Sign in to ${host}`,
        text: text({ url, host }),
        html: html({ url, host, theme }),
      })
      const failed = result.rejected.concat(result.pending).filter(Boolean)
      if (failed.length) {
        throw new Error(`Email (${failed.join(", ")}) could not be sent`)
      }
    },
    options: config,
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const brandColor = theme.brandColor || "#346df1"
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const buttonText = theme.buttonText || "#fff"

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
