/**
 * <div style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Asgardeo</b> integration.</span>
 * <a href="https://wso2.com/asgardeo/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/asgardeo-dark.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * ---
 * @module providers/asgardeo
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface AsgardeoProfile {
  sub: string
  given_name: string
  email: string
  picture: string
}

/**
 * Add Asgardeo login to your page.
 * ## Documentation
 *
 * https://wso2.com/asgardeo/docs/guides/authentication
 *
 *
 * ## Instructions
 *
 * - Log into https://console.asgardeo.io.
 * - Next, go to "Application" tab (More info: https://wso2.com/asgardeo/docs/guides/applications/register-oidc-web-app/).
 * - Register standard based - Open id connect, application.
 * - Add callback URL: http://localhost:3000/api/auth/callback/asgardeo and https://your-domain.com/api/auth/callback/asgardeo
 * - After registering the application, go to protocol tab.
 * - Check `code` grant type.
 * - Add Authorized redirect URLs & Allowed origins fields.
 * - Make Email, First Name, Photo URL user attributes mandatory from the console.
 *
 * Create a `.env` file in the project root add the following entries:
 *
 * These values can be collected from the application created.
 *
 * ```
 * ASGARDEO_CLIENT_ID=<Copy client ID from protocol tab here>
 * ASGARDEO_CLIENT_SECRET=<Copy client from protocol tab here>
 * ASGARDEO_ISSUER=<Copy the issuer url from the info tab here>
 * ```
 *
 * In `pages/api/auth/[...nextauth].js` find or add the `Asgardeo` entries:
 *
 * ```js
 * import Asgardeo from "next-auth/providers/asgardeo";
 * ...
 * providers: [
 *   Asgardeo({
 *     clientId: process.env.ASGARDEO_CLIENT_ID,
 *     clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
 *     issuer: process.env.ASGARDEO_ISSUER
 *   }),
 * ],
 *
 * ...
 * ```
 *
 * ## Resources
 *
 * @see [Asgardeo - Authentication Guide](https://wso2.com/asgardeo/docs/guides/authentication)
 * @see [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * @see [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/asgardeo.ts)
 *
 * ## Notes
 *
 * By default, Auth.js assumes that the Asgardeo provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Asgardeo provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/asgardeo.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
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
      logoDark: "/asgardeo-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff",
    },
    options: config,
  }
}
