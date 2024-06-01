/**
 * <div style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Passkey</b> integration.</span>
 * <a href="https://passkeys.dev">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/passkey.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/passkey
 */

import WebAuthn, {
  WebAuthnConfig,
  DEFAULT_WEBAUTHN_TIMEOUT,
} from "./webauthn.js"

/**
 * Add Passkey login to your page.
 *
 * ### Setup
 *
 * Install the required peer dependency.
 *
 * ```bash npm2yarn
 * npm install @simplewebauthn/browser@9.0.1
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Passkey from "@auth/core/providers/passkey"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Passkey],
 * })
 * ```
 * ### Resources
 *
 * - [SimpleWebAuthn - Server side](https://simplewebauthn.dev/docs/packages/server)
 * - [SimpleWebAuthn - Client side](https://simplewebauthn.dev/docs/packages/client)
 * - [Passkeys.dev - Intro](https://passkeys.dev/docs/intro/what-are-passkeys/)
 * - [Passkeys.dev - Specifications](https://passkeys.dev/docs/reference/specs/)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/passkey.ts)
 *
 * ### Notes
 *
 * This provider is an extension of the WebAuthn provider that defines some default values
 * associated with Passkey support. You may override these, but be aware that authenticators
 * may not recognize your credentials as Passkey credentials if you do.
 *
 * :::tip
 *
 * The Passkey provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/passkey.ts).
 * To override the defaults for your use case, check out [customizing a built-in WebAuthn provider](https://authjs.dev/guides/configuring-oauth-providers).
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
export default function Passkey(
  config: Partial<WebAuthnConfig>
): WebAuthnConfig {
  return WebAuthn({
    id: "passkey",
    name: "Passkey",
    authenticationOptions: {
      timeout: DEFAULT_WEBAUTHN_TIMEOUT,
      userVerification: "required",
    },
    registrationOptions: {
      timeout: DEFAULT_WEBAUTHN_TIMEOUT,
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    },
    verifyAuthenticationOptions: {
      requireUserVerification: true,
    },
    verifyRegistrationOptions: {
      requireUserVerification: true,
    },
    ...config,
  })
}
