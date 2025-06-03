/**
 * <div class="provider" style={{backgroundColor: "#0072c6", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Microsoft Entra ID</b> integration.</span>
 * <a href="https://learn.microsoft.com/en-us/entra/identity">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/microsoft-entra-id.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/microsoft-entra-id
 */
import { conformInternal, customFetch } from "../lib/symbols.js"
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/**
 * @see [Microsoft Identity Platform - ID token claims reference](https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference)
 * @see [Microsoft Identity Platform - Optional claims reference](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims-reference)
 */
export interface MicrosoftEntraIDProfile {
  /**
   * Identifies the intended recipient of the token. In `id_tokens`, the
   * audience is your app's Application ID, assigned to your app in the Azure
   * portal. This value should be validated. The token should be rejected if it
   * fails to match your app's Application ID.
   */
  aud: string
  /**
   * Identifies the issuer, or "authorization server" that constructs and
   * returns the token. It also identifies the tenant for which the user was
   * authenticated. If the token was issued by the v2.0 endpoint, the URI ends
   * in `/v2.0`. The GUID that indicates that the user is a consumer user from
   * a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app
   * should use the GUID portion of the claim to restrict the set of tenants
   * that can sign in to the app, if applicable.	 */
  iss: string
  /** Indicates when the authentication for the token occurred. */
  iat: Date
  /**
   * Records the identity provider that authenticated the subject of the token.
   * This value is identical to the value of the issuer claim unless the user
   * account isn't in the same tenant as the issuer - guests, for instance. If
   * the claim isn't present, it means that the value of `iss` can be used
   * instead. For personal accounts being used in an organizational context
   * (for instance, a personal account invited to a tenant), the `idp` claim
   * may be 'live.com' or an STS URI containing the Microsoft account tenant
   * `9188040d-6c67-4c5b-b112-36a304b66dad`.
   */
  idp: string
  /**
   * Identifies the time before which the JWT can't be accepted for processing.
   */
  nbf: Date
  /**
   * Identifies the expiration time on or after which the JWT can't be accepted
   * for processing. In certain circumstances, a resource may reject the token
   * before this time. For example, if a change in authentication is required
   * or a token revocation has been detected.
   */
  exp: Date
  /**
   * The code hash is included in ID tokens only when the ID token is issued
   * with an OAuth 2.0 authorization code. It can be used to validate the
   * authenticity of an authorization code. To understand how to do this
   * validation, see the
   * [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#HybridIDToken).
   * This claim isn't returned on ID tokens from the /token endpoint.
   */
  c_hash: string
  /**
   * The access token hash is included in ID tokens only when the ID token is
   * issued from the `/authorize` endpoint with an OAuth 2.0 access token. It
   * can be used to validate the authenticity of an access token. To understand
   * how to do this validation, see the
   * [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html#HybridIDToken).
   * This claim isn't returned on ID tokens from the `/token` endpoint.
   */
  at_hash: string
  /**
   * An internal claim that's used to record data for token reuse. Should be
   * ignored.
   */
  aio: string
  /**
   * The primary username that represents the user. It could be an email
   * address, phone number, or a generic username without a specified format.
   * Its value is mutable and might change over time. Since it's mutable, this
   * value can't be used to make authorization decisions. It can be used for
   * username hints and in human-readable UI as a username. The `profile` scope
   * is required to receive this claim. Present only in v2.0 tokens.
   */
  preferred_username: string
  /**
   * Present by default for guest accounts that have an email address. Your app
   * can request the email claim for managed users (from the same tenant as the
   * resource) using the `email`
   * [optional claim](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims).
   * This value isn't guaranteed to be correct and is mutable over time. Never
   * use it for authorization or to save data for a user. If you require an
   * addressable email address in your app, request this data from the user
   * directly by using this claim as a suggestion or prefill in your UX. On the
   * v2.0 endpoint, your app can also request the `email` OpenID Connect
   * scope - you don't need to request both the optional claim and the scope to
   * get the claim.
   */
  email: string
  /**
   * The `name` claim provides a human-readable value that identifies the
   * subject of the token. The value isn't guaranteed to be unique, it can be
   * changed, and should be used only for display purposes. The `profile` scope
   * is required to receive this claim.
   */
  name: string
  /**
   * The nonce matches the parameter included in the original authorize request
   * to the IDP. If it doesn't match, your application should reject the token.
   */
  nonce: string
  /**
   * The immutable identifier for an object, in this case, a user account. This
   * ID uniquely identifies the user across applications - two different
   * applications signing in the same user receives the same value in the `oid`
   * claim. Microsoft Graph returns this ID as the `id` property for a user
   * account. Because the `oid` allows multiple apps to correlate users, the
   * `profile` scope is required to receive this claim. If a single user exists
   * in multiple tenants, the user contains a different object ID in each
   * tenant - they're considered different accounts, even though the user logs
   * into each account with the same credentials. The `oid` claim is a GUID and
   * can't be reused.
   */
  oid: string
  /** The set of roles that were assigned to the user who is logging in. */
  roles: string[]
  /** An internal claim used to revalidate tokens. Should be ignored. */
  rh: string
  /**
   * The subject of the information in the token. For example, the user of an
   * app. This value is immutable and can't be reassigned or reused. The
   * subject is a pairwise identifier and is unique to an application ID. If a
   * single user signs into two different apps using two different client IDs,
   * those apps receive two different values for the subject claim. You may or
   * may not want two values depending on your architecture and privacy
   * requirements.
   */
  sub: string
  /** Represents the tenant that the user is signing in to. For work and school
   * accounts, the GUID is the immutable tenant ID of the organization that the
   * user is signing in to. For sign-ins to the personal Microsoft account
   * tenant (services like Xbox, Teams for Life, or Outlook), the value is
   * `9188040d-6c67-4c5b-b112-36a304b66dad`.
   */
  tid: string
  /**
   * Represents an unique identifier for a session and will be generated when a
   * new session is established.
   */
  sid: string
  /**
   * Token identifier claim, equivalent to jti in the JWT specification.
   * Unique, per-token identifier that is case-sensitive.
   */
  uti: string
  /** Indicates the version of the ID token. */
  ver: "2.0"
  /**
   * If present, always true, denoting the user is in at least one group.
   * Indicates that the client should use the Microsoft Graph API to determine
   * the user's groups
   * (`https://graph.microsoft.com/v1.0/users/{userID}/getMemberObjects`).
   */
  hasgroups: boolean
  /**
   * Users account status in tenant. If the user is a member of the tenant, the
   * value is `0`. If they're a guest, the value is `1`.
   */
  acct: 0 | 1
  /**
   * Auth Context IDs. Indicates the Auth Context IDs of the operations that
   * the bearer is eligible to perform. Auth Context IDs can be used to trigger
   * a demand for step-up authentication from within your application and
   * services. Often used along with the `xms_cc` claim.
   */
  acrs: string
  /** Time when the user last authenticated. */
  auth_time: Date
  /**
   * User's country/region. This claim is returned if it's present and the
   * value of the field is a standard two-letter country/region code, such as
   * FR, JP, SZ, and so on.
   */
  ctry: string
  /**
   * IP address. Adds the original address of the requesting client
   * (when inside a VNET).
   */
  fwd: string
  /**
   * Optional formatting for group claims. The `groups` claim is used with the
   * GroupMembershipClaims setting in the
   * [application manifest](https://learn.microsoft.com/en-us/entra/identity-platform/reference-app-manifest),
   * which must be set as well.
   */
  groups: string
  /**
   * Login hint. An opaque, reliable login hint claim that's base 64 encoded.
   * Don't modify this value. This claim is the best value to use for the
   * `login_hint` OAuth parameter in all flows to get SSO. It can be passed
   * between applications to help them silently SSO as well - application A can
   * sign in a user, read the `login_hint` claim, and then send the claim and
   * the current tenant context to application B in the query string or
   * fragment when the user selects on a link that takes them to application B.
   * To avoid race conditions and reliability issues, the `login_hint` claim
   * doesn't include the current tenant for the user, and defaults to the
   * user's home tenant when used. In a guest scenario where the user is from
   * another tenant, a tenant identifier must be provided in the sign-in
   * request. and pass the same to apps you partner with. This claim is
   * intended for use with your SDK's existing `login_hint` functionality,
   * however that it exposed.
   */
  login_hint: string
  /**
   * Resource tenant's country/region. Same as `ctry` except set at a tenant
   * level by an admin. Must also be a standard two-letter value.
   */
  tenant_ctry: string
  /**
   * Region of the resource tenant
   */
  tenant_region_scope: string
  /**
   * UserPrincipalName. An identifier for the user that can be used with the
   * `username_hint` parameter. Not a durable identifier for the user and
   * shouldn't be used for authorization or to uniquely identity user
   * information (for example, as a database key). Instead, use the user object
   * ID (`oid`) as a database key. For more information, see
   * [Secure applications and APIs by validating claims](https://learn.microsoft.com/en-us/entra/identity-platform/claims-validation).
   * Users signing in with an
   * [alternate login ID](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-use-email-signin)
   * shouldn't be shown their User Principal Name (UPN). Instead, use the
   * following ID token claims for displaying sign-in state to the user:
   * `preferred_username` or `unique_name` for v1 tokens and
   * `preferred_username` for v2 tokens. Although this claim is automatically
   * included, you can specify it as an optional claim to attach other
   * properties to modify its behavior in the guest user case. You should use
   * the `login_hint` claim for `login_hint` use - human-readable identifiers
   * like UPN are unreliable.
   */
  upn: string
  /** Sourced from the user's PrimaryAuthoritativeEmail */
  verified_primary_email: string[]
  /** Sourced from the user's SecondaryAuthoritativeEmail */
  verified_secondary_email: string[]
  /** VNET specifier information. */
  vnet: string
  /**
   * Client Capabilities. Indicates whether the client application that
   * acquired the token is capable of handling claims challenges. It's often
   * used along with claim `acrs`. This claim is commonly used in Conditional
   * Access and Continuous Access Evaluation scenarios. The resource server or
   * service application that the token is issued for controls the presence of
   * this claim in a token. A value of `cp1` in the access token is the
   * authoritative way to identify that a client application is capable of
   * handling a claims challenge. For more information, see
   * [Claims challenges, claims requests and client capabilities](https://learn.microsoft.com/en-us/entra/identity-platform/claims-challenge?tabs=dotnet).
   */
  xms_cc: string
  /**
   * Boolean value indicating whether the user's email domain owner has been
   * verified. An email is considered to be domain verified if it belongs to
   * the tenant where the user account resides and the tenant admin has done
   * verification of the domain. Also, the email must be from a Microsoft
   * account (MSA), a Google account, or used for authentication using the
   * one-time passcode (OTP) flow. Facebook and SAML/WS-Fed accounts do not
   * have verified domains. For this claim to be returned in the token, the
   * presence of the `email` claim is required.
   */
  xms_edov: boolean
  /**
   * Preferred data location. For Multi-Geo tenants, the preferred data
   * location is the three-letter code showing the geographic region the user
   * is in. For more information, see the
   * [Microsoft Entra Connect documentation about preferred data location](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-sync-feature-preferreddatalocation).
   */
  xms_pdl: string
  /**
   * User preferred language. The user's preferred language, if set. Sourced
   * from their home tenant, in guest access scenarios. Formatted LL-CC
   * ("en-us").
   */
  xms_pl: string
  /**
   * Tenant preferred language. The resource tenant's preferred language, if
   * set. Formatted LL ("en").
   */
  xms_tpl: string
  /**
   * Zero-touch Deployment ID. The device identity used for `Windows AutoPilot`.
   */
  ztdid: string
  /** IP Address. The IP address the client logged in from. */
  ipaddr: string
  /** On-premises Security Identifier */
  onprem_sid: string
  /**
   * Password Expiration Time. The number of seconds after the time in the
   * `iat` claim at which the password expires. This claim is only included
   * when the password is expiring soon (as defined by "notification days" in
   * the password policy).
   */
  pwd_exp: number
  /**
   * Change Password URL. A URL that the user can visit to change their
   * password. This claim is only included when the password is expiring soon
   * (as defined by "notification days" in the password policy).
   */
  pwd_url: string
  /**
   * Inside Corporate Network. Signals if the client is logging in from the
   * corporate network. If they're not, the claim isn't included. Based off of
   * the
   * [trusted IPs](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-mfa-mfasettings#trusted-ips)
   * settings in MFA.
   */
  in_corp: string
  /**
   * Last Name. Provides the last name, surname, or family name of the user as
   * defined in the user object. For example, `"family_name":"Miller"`.
   * Supported in MSA and Microsoft Entra ID. Requires the `profile` scope.
   */
  family_name: string
  /**
   * First name. Provides the first or "given" name of the user, as set on the
   * user object. For example, `"given_name": "Frank"`. Supported in MSA and
   * Microsoft Entra ID. Requires the `profile` scope.
   */
  given_name: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 *
 * ```
 * https://example.com/api/auth/callback/microsoft-entra-id
 * ```
 *
 * #### Environment Variables
 *
 * ```env
 * AUTH_MICROSOFT_ENTRA_ID_ID="<Application (client) ID>"
 * AUTH_MICROSOFT_ENTRA_ID_SECRET="<Client secret value>"
 * AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/<Directory (tenant) ID>/v2.0/"
 * ```
 *
 * #### Configuration
 *
 * When the `issuer` parameter is omitted it will default to
 * `"https://login.microsoftonline.com/common/v2.0/"`.
 * This allows any Microsoft account (Personal, School or Work) to log in.
 *
 * ```typescript
 * import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id"
 * ...
 * providers: [
 *   MicrosoftEntraID({
 *     clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
 *     clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
 *   }),
 * ]
 * ...
 * ```
 *
 * To only allow your organization's users to log in you will need to configure
 * the `issuer` parameter with your Directory (tenant) ID.
 *
 * ```env
 * AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/<Directory (tenant) ID>/v2.0/"
 * ```
 *
 * ```typescript
 * import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id"
 * ...
 * providers: [
 *   MicrosoftEntraID({
 *     clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
 *     clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
 *     issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
 *   }),
 * ]
 * ...
 * ```
 *
 * ### Resources
 *
 *  - [Microsoft Entra OAuth documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
 *  - [Microsoft Entra OAuth apps](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
 *
 * ### Notes
 *
 * Microsoft Entra ID returns the profile picture in an ArrayBuffer, instead of
 * just a URL to the image, so our provider converts it to a base64 encoded
 * image string and returns that instead. See:
 * https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples.
 * The default image size is 48x48 to avoid
 * [running out of space](https://next-auth.js.org/faq#json-web-tokens)
 * in case the session is saved as a JWT.
 *
 * By default, Auth.js assumes that the Microsoft Entra ID provider is based on
 * the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html)
 * specification.
 *
 * :::tip
 *
 * The Microsoft Entra ID provider comes with a
 * [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/microsoft-entra-id.ts).
 * To override the defaults for your use case, check out
 * [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can
 * [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take
 * responsibility for any deviation from the spec by the provider. You can open
 * an issue, but if the problem is non-compliance with the spec, we might not
 * pursue a resolution. You can ask for more help in
 * [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function MicrosoftEntraID(
  config: OIDCUserConfig<MicrosoftEntraIDProfile> & {
    /**
     * https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
     *
     * @default 48
     */
    profilePhotoSize?: 48 | 64 | 96 | 120 | 240 | 360 | 432 | 504 | 648
  }
): OIDCConfig<MicrosoftEntraIDProfile> {
  const { profilePhotoSize = 48 } = config

  // If issuer is not set, first fallback to environment variable, then
  // fallback to /common/ uri.
  config.issuer ??=
    process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER ||
    "https://login.microsoftonline.com/common/v2.0"

  return {
    id: "microsoft-entra-id",
    name: "Microsoft Entra ID",
    type: "oidc",
    authorization: { params: { scope: "openid profile email User.Read" } },
    async profile(profile, tokens) {
      // https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )

      // Confirm that profile photo was returned
      let image
      // TODO: Do this without Buffer
      if (response.ok && typeof Buffer !== "undefined") {
        try {
          const pictureBuffer = await response.arrayBuffer()
          const pictureBase64 = Buffer.from(pictureBuffer).toString("base64")
          image = `data:image/jpeg;base64, ${pictureBase64}`
        } catch {}
      }

      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: image ?? null,
      }
    },
    style: { text: "#fff", bg: "#0072c6" },
    async [customFetch](...args) {
      const url = new URL(args[0] instanceof Request ? args[0].url : args[0])
      if (url.pathname.endsWith(".well-known/openid-configuration")) {
        const response = await fetch(...args)
        const json = await response.clone().json()
        const tenantRe = /microsoftonline\.com\/(\w+)\/v2\.0/
        const tenantId = config.issuer?.match(tenantRe)?.[1] ?? "common"
        const issuer = json.issuer.replace("{tenantid}", tenantId)
        return Response.json({ ...json, issuer })
      }
      return fetch(...args)
    },
    [conformInternal]: true,
    options: config,
  }
}
