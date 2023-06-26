/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Descope</b> integration.
 * </span>
 * <a href="https://descope.com" style={{backgroundColor: "#000000", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/descope.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/descope
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from Descope when using the profile callback. */
export interface DescopeProfile {
  /** The user Descope ID */
  sub: string
  name: string
  email: string
  email_verified: boolean
  phone_number: string
  phone_number_verified: boolean
  picture: string
  /** Custom user's attributes */
  [claim: string]: unknown
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/descope
 * ```
 *
 * #### Configuration
 *
 * Import the provider and configure it in your **Auth.js** initialization file:
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import DescopeProvider from "next-auth/providers/descope";
 *
 * export default NextAuth({
 *  providers: [
 *    DescopeProvider({
 *      issuer: process.env.DESCOPE_ISSUER,
 *      clientSecret: process.env.DESCOPE_SECRET,
 *    }),
 *  ],
 * })
 * ```
 *
 * ### Configuring Descope
 *
 * Follow these steps:
 *
 * 1. Log into the [Descope console](https://app.descope.com)
 * 2. Follow the [OIDC instructions](https://docs.descope.com/customize/auth/oidc)
 *
 * Then, create a `.env` file in the project root add the following entries:
 *
 * Get the following from the Descope's console:
 * ```
 * DESCOPE_ISSUER="<Descope Issuer>" # Authentication Methods > SSO > Identity Provider
 * DESCOPE_SECRET="<Descope Access Key>" # Manage > Access Keys
 * ```
 *
 * ### Resources
 *
 * - [Descope OIDC](https://docs.descope.com/customize/auth/oidc)
 * - [Descope Flows](https://docs.descope.com/customize/flows)
 *
 * ### Notes
 *
 * The Descope provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/descope.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::info
 * By default, Auth.js assumes that the Descope provider is based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) spec
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
export default function Descope(
  config: OIDCUserConfig<DescopeProfile>
): OIDCConfig<DescopeProfile> {
  return {
    id: "descope",
    name: "Descope",
    type: "oidc",
    clientId: config?.issuer?.substring(config?.issuer?.lastIndexOf('/') + 1),
    style: {
      logo: "/descope.svg",
      logoDark: "/descope.svg",
      bg: "#1C1C23",
      text: "#ffffff",
      bgDark: "#1C1C23",
      textDark: "#ffffff",
    },
    options: config,
  }
}
