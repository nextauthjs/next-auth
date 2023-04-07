import type { AuthConfig } from "@auth/core"
import type { OAuthProviderType } from "@auth/core/providers"

// TODO: Generate this from the available providers
export const providersEnv: Record<OAuthProviderType, [string | undefined, string | undefined]> = {
  "42-school": [process.env.AUTH_42_SCHOOL_ID, process.env.AUTH_42_SCHOOL_SECRET],
  apple: [process.env.AUTH_APPLE_ID, process.env.AUTH_APPLE_SECRET],
  asgardeo: [process.env.AUTH_ASGARDEO_ID, process.env.AUTH_ASGARDEO_SECRET],
  atlassian: [process.env.AUTH_ATLASSIAN_ID, process.env.AUTH_ATLASSIAN_SECRET],
  auth0: [process.env.AUTH_AUTH0_ID, process.env.AUTH_AUTH0_SECRET],
  authentik: [process.env.AUTH_AUTHENTIK_ID, process.env.AUTH_AUTHENTIK_SECRET],
  "azure-ad": [process.env.AUTH_AAD_ID, process.env.AUTH_AAD_SECRET],
  "azure-ad-b2c": [process.env.AUTH_AAD_B2C_ID, process.env.AUTH_AAD_B2C_SECRET],
  battlenet: [process.env.AUTH_BATTLENET_ID, process.env.AUTH_BATTLENET_SECRET],
  beyondidentity: [process.env.AUTH_BEYOND_IDENTITY_ID, process.env.AUTH_BEYOND_IDENTITY_SECRET],
  box: [process.env.AUTH_BOX_ID, process.env.AUTH_BOX_SECRET],
  "boxyhq-saml": [process.env.AUTH_BOXYHQ_SAML_ID, process.env.AUTH_BOXYHQ_SAML_SECRET],
  bungie: [process.env.AUTH_BUNGIE_ID, process.env.AUTH_BUNGIE_SECRET],
  cognito: [process.env.AUTH_COGNITO_ID, process.env.AUTH_COGNITO_SECRET],
  coinbase: [process.env.AUTH_COINBASE_ID, process.env.AUTH_COINBASE_SECRET],
  discord: [process.env.AUTH_DISCORD_ID, process.env.AUTH_DISCORD_SECRET],
  dropbox: [process.env.AUTH_DROPBOX_ID, process.env.AUTH_DROPBOX_SECRET],
  "duende-identity-server6": [process.env.AUTH_IDS6_ID, process.env.AUTH_IDS6_SECRET],
  eveonline: [process.env.AUTH_EVEONLINE_ID, process.env.AUTH_EVEONLINE_SECRET],
  facebook: [process.env.AUTH_FACEBOOK_ID, process.env.AUTH_FACEBOOK_SECRET],
  faceit: [process.env.AUTH_FACEIT_ID, process.env.AUTH_FACEIT_SECRET],
  foursquare: [process.env.AUTH_FOURSQUARE_ID, process.env.AUTH_FOURSQUARE_SECRET],
  freshbooks: [process.env.AUTH_FRESHBOOKS_ID, process.env.AUTH_FRESHBOOKS_SECRET],
  fusionauth: [process.env.AUTH_FUSIONAUTH_ID, process.env.AUTH_FUSIONAUTH_SECRET],
  github: [process.env.AUTH_GITHUB_ID, process.env.AUTH_GITHUB_SECRET],
  gitlab: [process.env.AUTH_GITLAB_ID, process.env.AUTH_GITLAB_SECRET],
  google: [process.env.AUTH_GOOGLE_ID, process.env.AUTH_GOOGLE_SECRET],
  hubspot: [process.env.AUTH_HUBSPOT_ID, process.env.AUTH_HUBSPOT_SECRET],
  "identity-server4": [process.env.AUTH_IDS4_ID, process.env.AUTH_IDS4_SECRET],
  instagram: [process.env.AUTH_INSTAGRAM_ID, process.env.AUTH_INSTAGRAM_SECRET],
  kakao: [process.env.AUTH_KAKAO_ID, process.env.AUTH_KAKAO_SECRET],
  keycloak: [process.env.AUTH_KEYCLOAK_ID, process.env.AUTH_KEYCLOAK_SECRET],
  line: [process.env.AUTH_LINE_ID, process.env.AUTH_LINE_SECRET],
  linkedin: [process.env.AUTH_LINKEDIN_ID, process.env.AUTH_LINKEDIN_SECRET],
  mailchimp: [process.env.AUTH_MAILCHIMP_ID, process.env.AUTH_MAILCHIMP_SECRET],
  mailru: [process.env.AUTH_MAILRU_ID, process.env.AUTH_MAILRU_SECRET],
  mattermost: [process.env.AUTH_MATTERMOST_ID, process.env.AUTH_MATTERMOST_SECRET],
  medium: [process.env.AUTH_MEDIUM_ID, process.env.AUTH_MEDIUM_SECRET],
  naver: [process.env.AUTH_NAVER_ID, process.env.AUTH_NAVER_SECRET],
  netlify: [process.env.AUTH_NETLIFY_ID, process.env.AUTH_NETLIFY_SECRET],
  notion: [process.env.AUTH_NOTION_ID, process.env.AUTH_NOTION_SECRET],
  okta: [process.env.AUTH_OKTA_ID, process.env.AUTH_OKTA_SECRET],
  onelogin: [process.env.AUTH_ONELOGIN_ID, process.env.AUTH_ONELOGIN_SECRET],
  osso: [process.env.AUTH_OSSO_ID, process.env.AUTH_OSSO_SECRET],
  osu: [process.env.AUTH_OSU_ID, process.env.AUTH_OSU_SECRET],
  patreon: [process.env.AUTH_PATREON_ID, process.env.AUTH_PATREON_SECRET],
  pinterest: [process.env.AUTH_PINTEREST_ID, process.env.AUTH_PINTEREST_SECRET],
  pipedrive: [process.env.AUTH_PIPEDRIVE_ID, process.env.AUTH_PIPEDRIVE_SECRET],
  reddit: [process.env.AUTH_REDDIT_ID, process.env.AUTH_REDDIT_SECRET],
  salesforce: [process.env.AUTH_SALESFORCE_ID, process.env.AUTH_SALESFORCE_SECRET],
  slack: [process.env.AUTH_SLACK_ID, process.env.AUTH_SLACK_SECRET],
  spotify: [process.env.AUTH_SPOTIFY_ID, process.env.AUTH_SPOTIFY_SECRET],
  strava: [process.env.AUTH_STRAVA_ID, process.env.AUTH_STRAVA_SECRET],
  todoist: [process.env.AUTH_TODOIST_ID, process.env.AUTH_TODOIST_SECRET],
  trakt: [process.env.AUTH_TRAKT_ID, process.env.AUTH_TRAKT_SECRET],
  twitch: [process.env.AUTH_TWITCH_ID, process.env.AUTH_TWITCH_SECRET],
  twitter: [process.env.AUTH_TWITTER_ID, process.env.AUTH_TWITTER_SECRET],
  "united-effects": [process.env.AUTH_UNITED_EFFECTS_ID, process.env.AUTH_UNITED_EFFECTS_SECRET],
  vk: [process.env.AUTH_VK_ID, process.env.AUTH_VK_SECRET],
  wikimedia: [process.env.AUTH_WIKIMEDIA_ID, process.env.AUTH_WIKIMEDIA_SECRET],
  wordpress: [process.env.AUTH_WORDPRESS_ID, process.env.AUTH_WORDPRESS_SECRET],
  workos: [process.env.AUTH_WORKOS_ID, process.env.AUTH_WORKOS_SECRET],
  yandex: [process.env.AUTH_YANDEX_ID, process.env.AUTH_YANDEX_SECRET],
  zitadel: [process.env.AUTH_ZITADEL_ID, process.env.AUTH_ZITADEL_SECRET],
  zoho: [process.env.AUTH_ZOHO_ID, process.env.AUTH_ZOHO_SECRET],
  zoom: [process.env.AUTH_ZOOM_ID, process.env.AUTH_ZOOM_SECRET],
}

export function setEnvDefaults(config: AuthConfig) {
  config.secret ??= process.env.NEXTAUTH_SECRET
  config.trustHost ??= !!(process.env.NEXTAUTH_URL ?? process.env.AUTH_TRUST_HOST ?? process.env.VERCEL ?? process.env.NODE_ENV !== "production")
  config.providers = config.providers.map((p) => {
    if (typeof p !== "function") return p
    const provider = p()
    if (provider.type === "oauth" || provider.type === "oidc") {
      const [clientId, clientSecret] = providersEnv[provider.id] ?? []
      provider.clientId ??= clientId
      provider.clientSecret ??= clientSecret
    }
    return provider
  })
}
