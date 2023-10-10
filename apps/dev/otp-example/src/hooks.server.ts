import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
// import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"
import Credentials from "@auth/core/providers/credentials"
// import Email from "@auth/core/providers/email"
import OTP from "@auth/core/providers/otp"
import type { Provider } from "@auth/core/providers"

import { TestAdapter } from "./testAdapter"

const db: Record<string, any> = {}

import sgMail from "@sendgrid/mail"
import { MAIL_API_KEY, MAIL_VERIFIED_DOMAIN } from "$env/static/private"

export const handle = SvelteKitAuth({
  debug: true,
  adapter: TestAdapter({
    getItem(key) {
      return db[key]
    },
    setItem: function (key: string, value: string): Promise<void> {
      db[key] = value
      return Promise.resolve()
    },
    deleteItems: function (...keys: string[]): Promise<void> {
      keys.forEach((key) => delete db[key])
      return Promise.resolve()
    },
  }),
  providers: [
    // Credentials({
    //   credentials: { password: { label: "Password", type: "password" } },
    //   async authorize(credentials) {
    //     if (credentials.password !== "pw") return null
    //     return {
    //       name: "Fill Murray",
    //       email: "bill@fillmurray.com",
    //       image: "https://www.fillmurray.com/64/64",
    //       id: "1",
    //       foo: "",
    //     }
    //   },
    // }),
    OTP({
      async sendVerificationRequest({ identifier, token, provider }) {
        console.log(`SENDING VERIFICATION ${token} to ${identifier} `)
        // comment out the rest of this function to test without actually sending email
        // otp token is hardcoded to 123456
        sgMail.setApiKey(MAIL_API_KEY)
        // console.log(MAIL_FROM)
        const message = {
          to: identifier,
          from: `noreply@${MAIL_VERIFIED_DOMAIN}`,
          subject: "Sign in to My App",
          html: `Your OTP code is ${token}`,
          text: `Your OTP code is ${token}`,
        }
        try {
          const resp = await sgMail.send(message)
          console.log({ resp })
        } catch (e: any) {
          console.error(e)
          console.log(e.response.body.errors)
        }
      },
    }),
    // NOTE: You can start a fake e-mail server with `pnpm email`
    // and then go to `http://localhost:1080` in the browser
    // Email({
    //   async sendVerificationRequest(params) {
    //     console.log({ params })
    //   },
    // }),
    // GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })
  ] as Provider[],
  secret: "some-secret",
  trustHost: true,
})
