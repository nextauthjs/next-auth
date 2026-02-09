/**
 * <div class="provider" style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
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
 * Install the required peer dependencies (SimpleWebAuthn v13).
 *
 * ```bash npm2yarn
 * npm install @simplewebauthn/browser@^13.2.2 @simplewebauthn/server@^13.2.2
 * ```
 *
 * Both packages are optional peer dependencies; the server package is used for
 * generating and verifying options, the browser package for the sign-in page script.
 * As of v13, types are exported from the browser and server packages (no separate
 * `@simplewebauthn/types` package).
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
 * associated with Passkey support (e.g. resident key, user verification). You may override
 * these, but be aware that authenticators may not recognize your credentials as Passkey
 * credentials if you do.
 *
 * **SimpleWebAuthn v13:** Auth.js uses the v13 API: credential IDs in options are base64
 * strings; `verifyAuthenticationResponse` expects a `credential` (id, publicKey, counter);
 * `verifyRegistrationResponse` returns `registrationInfo.credential` with the same shape;
 * and the browser helpers use a single options object (`optionsJSON`, `useBrowserAutofill`).
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
