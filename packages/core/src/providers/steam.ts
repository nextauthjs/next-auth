/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Steam</b> integration.</span>
 * <a href="https://store.steampowered.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/steam.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/steam
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

const STEAM_PROVIDER_ID = "steam"
const STEAM_AUTHORIZATION_URL = "https://steamcommunity.com/openid/login"
const STEAM_API_URL =
  "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002"
const STEAM_OPENID_NS = "http://specs.openid.net/auth/2.0"
const STEAM_CLAIMED_ID_PREFIX = "https://steamcommunity.com/openid/id/"
const STEAM_ID_PATTERN = /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/

/**
 * The profile returned by Steam's GetPlayerSummaries API.
 *
 * See the [Steam Web API documentation](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29).
 */
export interface SteamProfile extends Record<string, unknown> {
  /** 64-bit SteamID of the user. */
  steamid: string
  /** This represents whether the profile is visible or not. */
  communityvisibilitystate: number
  /** If set, indicates the user has a community profile configured. */
  profilestate: number
  /** The player's persona name (display name). */
  personaname: string
  /** The full URL of the player's Steam Community profile page. */
  profileurl: string
  /** The full URL of the player's 32x32px avatar. */
  avatar: string
  /** The full URL of the player's 64x64px avatar. */
  avatarmedium: string
  /** The full URL of the player's 184x184px avatar. */
  avatarfull: string
  /** SHA1 hash of the player's avatar. */
  avatarhash: string
  /** Unix timestamp of the last time the user was online. */
  lastlogoff: number
  /** The user's current status. */
  personastate: number
  /** The primary clan for this user. */
  primaryclanid: string
  /** Unix timestamp of the date the profile was created. */
  timecreated: number
  /** Additional flags for the persona state. */
  personastateflags: number
}

/**
 * Configuration options for the Steam provider.
 */
export interface SteamProviderOptions extends Omit<
  OAuthUserConfig<SteamProfile>,
  "clientId" | "clientSecret"
> {
  /**
   * Your Steam Web API Key. Obtain one at:
   * https://steamcommunity.com/dev/apikey
   */
  clientSecret: string
  /**
   * Override the base callback URL. Defaults to `AUTH_URL` / `NEXTAUTH_URL`.
   * Must **not** have a trailing slash.
   *
   * @example "https://example.com/api/auth/callback"
   */
  callbackUrl?: string
}

/**
 * Verifies the Steam OpenID 2.0 assertion using the check_authentication
 * mode — a direct HTTP POST to Steam's OpenID endpoint.
 *
 * This avoids any Node.js-only dependencies and works in any JS runtime
 * (Edge, Node, Deno, Bun).
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html
 * @see https://steamcommunity.com/dev
 */
async function verifySteamAssertion(
  params: Record<string, string | undefined>,
  returnTo: string
): Promise<string> {
  if (
    params["openid.op_endpoint"] !== STEAM_AUTHORIZATION_URL ||
    params["openid.ns"] !== STEAM_OPENID_NS
  ) {
    throw new Error(
      "Steam OpenID assertion failed: invalid endpoint or namespace"
    )
  }

  const claimedId = params["openid.claimed_id"] ?? ""
  if (!claimedId.startsWith(STEAM_CLAIMED_ID_PREFIX)) {
    throw new Error(
      "Steam OpenID assertion failed: claimed_id does not match Steam pattern"
    )
  }

  const identity = params["openid.identity"] ?? ""
  if (!identity.startsWith(STEAM_CLAIMED_ID_PREFIX)) {
    throw new Error(
      "Steam OpenID assertion failed: identity does not match Steam pattern"
    )
  }

  // Rebuild the params for check_authentication verification
  const verifyBody = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) verifyBody.set(key, value)
  }
  verifyBody.set("openid.mode", "check_authentication")
  // Ensure the return_to matches what we set in the authorization request
  verifyBody.set("openid.return_to", returnTo)

  const verifyResponse = await fetch(STEAM_AUTHORIZATION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyBody.toString(),
  })

  if (!verifyResponse.ok) {
    throw new Error(
      `Steam OpenID verification request failed: ${verifyResponse.status}`
    )
  }

  const verifyText = await verifyResponse.text()

  if (!verifyText.includes("is_valid:true")) {
    throw new Error(
      "Steam OpenID assertion is invalid (Steam returned is_valid:false)"
    )
  }

  const match = claimedId.match(STEAM_ID_PATTERN)
  if (!match?.[1]) {
    throw new Error(
      "Steam OpenID assertion failed: could not extract Steam ID from claimed_id"
    )
  }

  return match[1]
}

/**
 * Add Steam login to your page.
 *
 * :::note
 * Steam uses **OpenID 2.0**, not OAuth 2.0 / OIDC. This means the provider
 * requires the `token.request` hook in Auth.js core's `handleOAuth` callback,
 * which bypasses the standard `oauth4webapi` code-grant flow.
 * :::
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/steam
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Steam from "@auth/core/providers/steam"
 *
 * const response = await Auth(request, {
 *   providers: [
 *     Steam({ clientSecret: process.env.STEAM_API_KEY }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Steam OpenID documentation](https://steamcommunity.com/dev)
 * - [Obtaining a Steam Web API Key](https://steamcommunity.com/dev/apikey)
 * - [Steam Web API reference](https://developer.valvesoftware.com/wiki/Steam_Web_API)
 *
 * ### Notes
 *
 * Unlike all other built-in providers, Steam uses **OpenID 2.0** — a protocol
 * older than and incompatible with OAuth 2.0. The differences are:
 *
 * - There is no `code` exchanged. Steam redirects back with OpenID assertion
 *   params (e.g. `openid.claimed_id`, `openid.sig`) in the callback URL.
 * - Verification is done by re-posting those params to Steam with
 *   `openid.mode=check_authentication`.
 * - A Steam Web API key (`clientSecret`) is required to fetch the user profile
 *   after authentication.
 *
 * :::tip
 *
 * The Steam provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/steam.ts).
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
export default function Steam(
  options: SteamProviderOptions
): OAuthConfig<SteamProfile> {
  if (!options.clientSecret) {
    throw new Error(
      "Steam provider requires `clientSecret` (your Steam Web API Key). " +
        "Obtain one at: https://steamcommunity.com/dev/apikey"
    )
  }

  const callbackBase = options.callbackUrl
    ? new URL(options.callbackUrl)
    : new URL(
        "/api/auth/callback",
        process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
      )

  const realm = callbackBase.origin
  const returnTo = `${callbackBase.href}/${STEAM_PROVIDER_ID}`

  return {
    id: STEAM_PROVIDER_ID,
    name: "Steam",
    type: "oauth",
    style: {
      logo: "https://authjs.dev/img/providers/steam.svg",
      bg: "#000000",
      text: "#ffffff",
    },
    /**
     * Steam does not use PKCE or state — the OpenID 2.0 protocol
     * has its own replay-protection via openid.nonce.
     */
    checks: ["none"],
    clientId: STEAM_PROVIDER_ID,
    clientSecret: options.clientSecret,
    authorization: {
      url: STEAM_AUTHORIZATION_URL,
      params: {
        "openid.mode": "checkid_setup",
        "openid.ns": STEAM_OPENID_NS,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id":
          "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.return_to": returnTo,
        "openid.realm": realm,
      },
    },
    /**
     * Steam's OpenID 2.0 does not issue an authorization code, so the standard
     * OAuth 2.0 token exchange is bypassed entirely via `token.request`.
     *
     * The `params` object here contains the raw OpenID assertion query params
     * that Steam appended to the callback URL (openid.mode, openid.sig, etc.).
     * We re-post them to Steam with `openid.mode=check_authentication` to
     * confirm the assertion server-side, then extract the Steam ID.
     *
     * The Steam ID is stored as `access_token` so that `userinfo.request`
     * can use it to call the Steam Web API.
     *
     */
    token: {
      async request({ params, provider }) {
        const callbackUrl =
          (provider as { callbackUrl?: string }).callbackUrl ?? returnTo

        const steamId = await verifySteamAssertion(
          params as Record<string, string | undefined>,
          callbackUrl
        )

        return {
          tokens: {
            access_token: steamId,
            token_type: "bearer",
          },
        }
      },
    },
    /**
     * Uses the Steam ID (stored as `access_token` from the token step) to
     * call the Steam Web API and retrieve the full player profile.
     *
     */
    userinfo: {
      async request({ tokens, provider }) {
        const steamId = tokens.access_token
        if (!steamId) {
          throw new Error(
            "Steam provider: access_token (Steam ID) is missing from tokens"
          )
        }

        const url = new URL(STEAM_API_URL)
        url.searchParams.set("key", provider.clientSecret as string)
        url.searchParams.set("steamids", steamId)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(
            `Steam API request failed: ${response.status} ${response.statusText}`
          )
        }

        const data = (await response.json()) as {
          response: { players: SteamProfile[] }
        }

        const player = data.response.players[0]
        if (!player) {
          throw new Error(
            `Steam API returned no player for Steam ID: ${steamId}`
          )
        }

        return player
      },
    },
    profile(profile: SteamProfile) {
      return {
        id: profile.steamid,
        name: profile.personaname,
        /**
         * Steam does not expose email addresses via its public API.
         * We synthesize one from the Steam ID so that Auth.js does not
         * reject the profile (email is required by the User model).
         * Apps that need a real email should collect it separately after sign-in.
         */
        email: `${profile.steamid}@steamcommunity.com`,
        image: profile.avatarfull,
      }
    },
    options,
  }
}
