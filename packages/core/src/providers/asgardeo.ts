/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Asgardeo</b> integration.
 * </span>
 * <a href="https://wso2.com/asgardeo/" style={{backgroundColor: "#ECEFF1", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/asgardeo.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/asgardeo
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from Asgardeo when using the profile callback. */
export interface AsgardeoProfile extends Record<string, any> {
  /**
   * The user Asgardeo account ID
   */
  sub: string
  /**
   * The user name
   */
  given_name: string
  /**
   * The user email
   */
  email: string
  /**
   * The user profile picture
   */
  picture: string
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/asgardeo
 * ```
 *
 * #### Configuration
 *
 * Import the provider and configure it in your **Auth.js** initialization file:
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import AsgardeoProvider from "next-auth/providers/asgardeo";
 *
 * export default NextAuth({
 *  providers: [
 *    AsgardeoProvider({
 *      clientId: process.env.ASGARDEO_CLIENT_ID,
 *      clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
 *      issuer: process.env.ASGARDEO_ISSUER
 *    }),
 *  ],
 * })
 * ```
 *
 * ### Configuring Asgardeo
 *
 * Follow these steps:
 *
 * 1. Log into the [Asgardeo console](https://console.asgardeo.io)
 * 2. Next, go to "Application" tab (more info [here](https://wso2.com/asgardeo/docs/guides/applications/register-oidc-web-app/))
 * 3. Register a standard based, Open ID connect, application
 * 4. Add the **callback URLs**: `http://localhost:3000/api/auth/callback/asgardeo` (development) and `https://{YOUR_DOMAIN}.com/api/auth/callback/asgardeo` (production)
 * 5. After registering the application, go to "Protocol" tab.
 * 6. Check `code` as the grant type.
 * 7. Add "Authorized redirect URLs" & "Allowed origins fields"
 * 8. Make Email, First Name, Photo URL user attributes mandatory from the console.
 *
 * Then, create a `.env` file in the project root add the following entries:
 *
 * ```
 * ASGARDEO_CLIENT_ID="Copy client ID from protocol tab here"
 * ASGARDEO_CLIENT_SECRET="Copy client from protocol tab here"
 * ASGARDEO_ISSUER="Copy the issuer url from the info tab here"
 * ```
 *
 * ### Resources
 *
 * - [Asgardeo - Authentication Guide](https://wso2.com/asgardeo/docs/guides/authentication)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 *
 * ### Notes
 *
 * The Asgardeo provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/asgardeo.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::info
 * By default, Auth.js assumes that the Asgardeo provider is based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) spec
 * :::
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Asgardeo(
  config: OIDCUserConfig<AsgardeoProfile>
): OIDCConfig<AsgardeoProfile> {
  return {
    id: "asgardeo",
    name: "Asgardeo",
    type: "oidc",
    wellKnown: `${config?.issuer}/oauth2/token/.well-known/openid-configuration`,
    style: {
      logo: "/asgardeo.svg",
      bg: "#000",
      text: "#fff",
    },
    options: config,
  }
}
