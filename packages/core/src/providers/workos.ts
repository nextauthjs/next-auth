/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>WorkOS</b> integration.</span>
 * <a href="https://workos.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/workos.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/workos
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"
/**
 * - {@link https://workos.com/docs/reference/sso/profile | The returned profile object}
 */
export interface WorkOSProfile extends Record<string, any> {
  object: string
  id: string
  organization_id: string
  connection_id: string
  connection_type: string
  idp_id: string
  email: string
  first_name: string
  last_name: string
  raw_attributes: {
    id: string
    email: string
    lastName: string
    firstName: string
    picture: string
  }
}

/**
 * Add WorkOS login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/workos
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import WorkOS from "@auth/core/providers/workos"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     WorkOS({
 *       clientId: WORKOS_CLIENT_ID,
 *       clientSecret: WORKOS_CLIENT_SECRET,
 *       issuer: WORKOS_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [WorkOS SSO OAuth documentation](https://workos.com/docs/reference/sso)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the WorkOS provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * WorkOS is not an identity provider itself, but, rather, a bridge to multiple single sign-on (SSO) providers.
 * As a result, we need to make some additional changes to authenticate users using WorkOS.
 *
 * In order to sign a user in using WorkOS, we need to specify which WorkOS Connection to use.
 * A common way to do this is to collect the user's email address and extract the domain. This can be done using a custom login page.
 * To add a custom login page, you can use the `pages` option:
 * ```ts
 * pages: {
 *   signIn: "/auth/signin",
 * }
 * ```
 * We can then add a custom login page that displays an input where the user can enter their email address.
 * We then extract the domain from the user's email address and pass it to the `authorizationParams` parameter on the `signIn` function:
 * ```js title="pages/auth/signin.js"
 * import { useState } from "react"
 * import { getProviders, signIn } from "next-auth/react"
 *
 * export default function SignIn({ providers }) {
 *   const [email, setEmail] = useState("")
 *
 *   return (
 *     <>
 *       {Object.values(providers).map((provider) => {
 *         if (provider.id === "workos") {
 *           return (
 *             <div key={provider.id}>
 *               <input
 *                 type="email"
 *                 value={email}
 *                 placeholder="Email"
 *                 onChange={(event) => setEmail(event.target.value)}
 *               />
 *               <button
 *                 onClick={() =>
 *                   signIn(provider.id, undefined, {
 *                     domain: email.split("@")[1],
 *                   })
 *                 }
 *               >
 *                 Sign in with SSO
 *               </button>
 *             </div>
 *           )
 *         }
 *
 *         return (
 *           <div key={provider.id}>
 *             <button onClick={() => signIn(provider.id)}>
 *               Sign in with {provider.name}
 *             </button>
 *           </div>
 *         )
 *       })}
 *     </>
 *   )
 * }
 *
 * export async function getServerSideProps(context) {
 *   const providers = await getProviders()
 *   return {
 *     props: { providers },
 *   }
 * }
 * ```
 *
 * :::tip
 *
 * The WorkOS provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/workos.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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
export default function WorkOS<P extends WorkOSProfile>(
  options: OAuthUserConfig<P> & { connection?: string }
): OAuthConfig<P> {
  const { issuer = "https://api.workos.com/", connection = "" } = options

  const connectionParams = new URLSearchParams({ connection })

  return {
    id: "workos",
    name: "WorkOS",
    type: "oauth",
    authorization: `${issuer}sso/authorize?${connectionParams}`,
    token: `${issuer}sso/token`,
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    userinfo: `${issuer}sso/profile`,
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.raw_attributes.picture ?? null,
      }
    },
    style: { bg: "#6363f1", text: "#fff" },
    options,
  }
}
