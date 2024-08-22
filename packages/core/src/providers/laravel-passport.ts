/**
 * <div style={{backgroundColor: "#ff2d20", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Laravel Passport</b> integration.</span>
 * <a href="https://laravel.com/docs/11.x/passport">
 *   <img style={{display: "block"}} src="https://laravel.com/img/logomark.min.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/passport
 */
import type { TokenSet } from '@auth/core/types'
import type { OAuthConfig, OAuthUserConfig } from '@auth/core/providers'

/**
 * [More info](https://github.com/laravel/laravel/blob/master/app/Models/User.php)
 */
export interface LaravelPassportProfile extends Record<string, any> {
    id: number
    name: string
    email: string
    created_at: string
    updated_at: string
}

/**
 * Add Laravel Passport login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/laravel-passport
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Laravel Passport from "@auth/core/providers/laravel-passport"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     LaravelPassport({ baseUrl: LARAVEL_PASSPORT_BASE_URL, clientId: LARAVEL_PASSPORT_CLIENT_KEY, clientSecret: LARAVEL_PASSPORT_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *  - [Laravel Passport Documentation](https://laravel.com/docs/11.x/passport)
 *
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Laravel Passport provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Laravel Passport provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/laravel-passport.ts).
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
export default function LaravelPassport<P extends LaravelPassportProfile>(
    options: OAuthUserConfig<P> & {
        baseUrl: string
    },
  ): OAuthConfig<P> {
    return {
        id: "laravel-passport",
        name: "Laravel Passport",
        type: "oauth",

        authorization: {
            url: `${options.baseUrl}/oauth/authorize`,
            params: {
                scope: "",
            },
        },
        token: {
            url: `${options.baseUrl}/oauth/token`,
        },
        userinfo: {
            url: `${options.baseUrl}/api/user`,
        },
        profile(profile) {
            return {
                id: profile.id.toString(),
                name: profile.name,
                email: profile.email,
            }
        },
        checks: ["state"],
        style: {
            bg: "#ff2d20",
            text: "#fff",
            logo: "https://laravel.com/img/logomark.min.svg"
        },
        options,
    }
}
