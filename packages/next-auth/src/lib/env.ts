import type { NextAuthConfig } from "./index.js"
import type { OAuthProviderType } from "@auth/core/providers"

// TODO: Generate this from the available providers
export const providersEnv: Record<OAuthProviderType, Array<string | undefined>> = {
  "42-school": [process.env.AUTH_42_SCHOOL_ID, process.env.AUTH_42_SCHOOL_SECRET, process.env.AUTH_42_SCHOOL_ISSUER],
  apple: [process.env.AUTH_APPLE_ID, process.env.AUTH_APPLE_SECRET, process.env.AUTH_APPLE_ISSUER],
  asgardeo: [process.env.AUTH_ASGARDEO_ID, process.env.AUTH_ASGARDEO_SECRET, process.env.AUTH_ASGARDEO_ISSUER],
  atlassian: [process.env.AUTH_ATLASSIAN_ID, process.env.AUTH_ATLASSIAN_SECRET, process.env.AUTH_ATLASSIAN_ISSUER],
  auth0: [process.env.AUTH_AUTH0_ID, process.env.AUTH_AUTH0_SECRET, process.env.AUTH_AUTH0_ISSUER],
  authentik: [process.env.AUTH_AUTHENTIK_ID, process.env.AUTH_AUTHENTIK_SECRET, process.env.AUTH_AUTHENTIK_ISSUER],
  "azure-ad": [process.env.AUTH_AAD_ID, process.env.AUTH_AAD_SECRET, process.env.AUTH_AAD_ISSUER],
  "azure-ad-b2c": [process.env.AUTH_AAD_B2C_ID, process.env.AUTH_AAD_B2C_SECRET, process.env.AUTH_AAD_B2C_ISSUER],
  battlenet: [process.env.AUTH_BATTLENET_ID, process.env.AUTH_BATTLENET_SECRET, process.env.AUTH_BATTLENET_ISSUER],
  beyondidentity: [process.env.AUTH_BEYOND_IDENTITY_ID, process.env.AUTH_BEYOND_IDENTITY_SECRET, process.env.AUTH_BEYOND_IDENTITY_ISSUER],
  box: [process.env.AUTH_BOX_ID, process.env.AUTH_BOX_SECRET, process.env.AUTH_BOX_ISSUER],
  "boxyhq-saml": [process.env.AUTH_BOXYHQ_SAML_ID, process.env.AUTH_BOXYHQ_SAML_SECRET, process.env.AUTH_BOXYHQ_SAML_ISSUER],
  bungie: [process.env.AUTH_BUNGIE_ID, process.env.AUTH_BUNGIE_SECRET, process.env.AUTH_BUNGIE_ISSUER],
  cognito: [process.env.AUTH_COGNITO_ID, process.env.AUTH_COGNITO_SECRET, process.env.AUTH_COGNITO_ISSUER],
  coinbase: [process.env.AUTH_COINBASE_ID, process.env.AUTH_COINBASE_SECRET, process.env.AUTH_COINBASE_ISSUER],
  descope: [process.env.AUTH_DESCOPE_ID, process.env.AUTH_DESCOPE_SECRET],
  discord: [process.env.AUTH_DISCORD_ID, process.env.AUTH_DISCORD_SECRET, process.env.AUTH_DISCORD_ISSUER],
  dropbox: [process.env.AUTH_DROPBOX_ID, process.env.AUTH_DROPBOX_SECRET, process.env.AUTH_DROPBOX_ISSUER],
  "duende-identity-server6": [process.env.AUTH_IDS6_ID, process.env.AUTH_IDS6_SECRET, process.env.AUTH_IDS6_ISSUER],
  eveonline: [process.env.AUTH_EVEONLINE_ID, process.env.AUTH_EVEONLINE_SECRET, process.env.AUTH_EVEONLINE_ISSUER],
  facebook: [process.env.AUTH_FACEBOOK_ID, process.env.AUTH_FACEBOOK_SECRET, process.env.AUTH_FACEBOOK_ISSUER],
  faceit: [process.env.AUTH_FACEIT_ID, process.env.AUTH_FACEIT_SECRET, process.env.AUTH_FACEIT_ISSUER],
  foursquare: [process.env.AUTH_FOURSQUARE_ID, process.env.AUTH_FOURSQUARE_SECRET, process.env.AUTH_FOURSQUARE_ISSUER],
  freshbooks: [process.env.AUTH_FRESHBOOKS_ID, process.env.AUTH_FRESHBOOKS_SECRET, process.env.AUTH_FRESHBOOKS_ISSUER],
  fusionauth: [process.env.AUTH_FUSIONAUTH_ID, process.env.AUTH_FUSIONAUTH_SECRET, process.env.AUTH_FUSIONAUTH_ISSUER],
  github: [process.env.AUTH_GITHUB_ID, process.env.AUTH_GITHUB_SECRET, process.env.AUTH_GITHUB_ISSUER],
  gitlab: [process.env.AUTH_GITLAB_ID, process.env.AUTH_GITLAB_SECRET, process.env.AUTH_GITLAB_ISSUER],
  google: [process.env.AUTH_GOOGLE_ID, process.env.AUTH_GOOGLE_SECRET, process.env.AUTH_GOOGLE_ISSUER],
  hubspot: [process.env.AUTH_HUBSPOT_ID, process.env.AUTH_HUBSPOT_SECRET, process.env.AUTH_HUBSPOT_ISSUER],
  "identity-server4": [process.env.AUTH_IDS4_ID, process.env.AUTH_IDS4_SECRET, process.env.AUTH_IDS4_ISSUER],
  instagram: [process.env.AUTH_INSTAGRAM_ID, process.env.AUTH_INSTAGRAM_SECRET, process.env.AUTH_INSTAGRAM_ISSUER],
  kakao: [process.env.AUTH_KAKAO_ID, process.env.AUTH_KAKAO_SECRET, process.env.AUTH_KAKAO_ISSUER],
  keycloak: [process.env.AUTH_KEYCLOAK_ID, process.env.AUTH_KEYCLOAK_SECRET, process.env.AUTH_KEYCLOAK_ISSUER],
  line: [process.env.AUTH_LINE_ID, process.env.AUTH_LINE_SECRET, process.env.AUTH_LINE_ISSUER],
  linkedin: [process.env.AUTH_LINKEDIN_ID, process.env.AUTH_LINKEDIN_SECRET, process.env.AUTH_LINKEDIN_ISSUER],
  mailchimp: [process.env.AUTH_MAILCHIMP_ID, process.env.AUTH_MAILCHIMP_SECRET, process.env.AUTH_MAILCHIMP_ISSUER],
  mailru: [process.env.AUTH_MAILRU_ID, process.env.AUTH_MAILRU_SECRET, process.env.AUTH_MAILRU_ISSUER],
  mattermost: [process.env.AUTH_MATTERMOST_ID, process.env.AUTH_MATTERMOST_SECRET, process.env.AUTH_MATTERMOST_ISSUER],
  medium: [process.env.AUTH_MEDIUM_ID, process.env.AUTH_MEDIUM_SECRET, process.env.AUTH_MEDIUM_ISSUER],
  naver: [process.env.AUTH_NAVER_ID, process.env.AUTH_NAVER_SECRET, process.env.AUTH_NAVER_ISSUER],
  netlify: [process.env.AUTH_NETLIFY_ID, process.env.AUTH_NETLIFY_SECRET, process.env.AUTH_NETLIFY_ISSUER],
  notion: [process.env.AUTH_NOTION_ID, process.env.AUTH_NOTION_SECRET, process.env.AUTH_NOTION_ISSUER],
  okta: [process.env.AUTH_OKTA_ID, process.env.AUTH_OKTA_SECRET, process.env.AUTH_OKTA_ISSUER],
  onelogin: [process.env.AUTH_ONELOGIN_ID, process.env.AUTH_ONELOGIN_SECRET, process.env.AUTH_ONELOGIN_ISSUER],
  osso: [process.env.AUTH_OSSO_ID, process.env.AUTH_OSSO_SECRET, process.env.AUTH_OSSO_ISSUER],
  osu: [process.env.AUTH_OSU_ID, process.env.AUTH_OSU_SECRET, process.env.AUTH_OSU_ISSUER],
  patreon: [process.env.AUTH_PATREON_ID, process.env.AUTH_PATREON_SECRET, process.env.AUTH_PATREON_ISSUER],
  pinterest: [process.env.AUTH_PINTEREST_ID, process.env.AUTH_PINTEREST_SECRET, process.env.AUTH_PINTEREST_ISSUER],
  pipedrive: [process.env.AUTH_PIPEDRIVE_ID, process.env.AUTH_PIPEDRIVE_SECRET, process.env.AUTH_PIPEDRIVE_ISSUER],
  reddit: [process.env.AUTH_REDDIT_ID, process.env.AUTH_REDDIT_SECRET, process.env.AUTH_REDDIT_ISSUER],
  salesforce: [process.env.AUTH_SALESFORCE_ID, process.env.AUTH_SALESFORCE_SECRET, process.env.AUTH_SALESFORCE_ISSUER],
  slack: [process.env.AUTH_SLACK_ID, process.env.AUTH_SLACK_SECRET, process.env.AUTH_SLACK_ISSUER],
  spotify: [process.env.AUTH_SPOTIFY_ID, process.env.AUTH_SPOTIFY_SECRET, process.env.AUTH_SPOTIFY_ISSUER],
  strava: [process.env.AUTH_STRAVA_ID, process.env.AUTH_STRAVA_SECRET, process.env.AUTH_STRAVA_ISSUER],
  todoist: [process.env.AUTH_TODOIST_ID, process.env.AUTH_TODOIST_SECRET, process.env.AUTH_TODOIST_ISSUER],
  trakt: [process.env.AUTH_TRAKT_ID, process.env.AUTH_TRAKT_SECRET, process.env.AUTH_TRAKT_ISSUER],
  twitch: [process.env.AUTH_TWITCH_ID, process.env.AUTH_TWITCH_SECRET, process.env.AUTH_TWITCH_ISSUER],
  twitter: [process.env.AUTH_TWITTER_ID, process.env.AUTH_TWITTER_SECRET, process.env.AUTH_TWITTER_ISSUER],
  "united-effects": [process.env.AUTH_UNITED_EFFECTS_ID, process.env.AUTH_UNITED_EFFECTS_SECRET, process.env.AUTH_UNITED_EFFECTS_ISSUER],
  vk: [process.env.AUTH_VK_ID, process.env.AUTH_VK_SECRET, process.env.AUTH_VK_ISSUER],
  wikimedia: [process.env.AUTH_WIKIMEDIA_ID, process.env.AUTH_WIKIMEDIA_SECRET, process.env.AUTH_WIKIMEDIA_ISSUER],
  wordpress: [process.env.AUTH_WORDPRESS_ID, process.env.AUTH_WORDPRESS_SECRET, process.env.AUTH_WORDPRESS_ISSUER],
  workos: [process.env.AUTH_WORKOS_ID, process.env.AUTH_WORKOS_SECRET, process.env.AUTH_WORKOS_ISSUER],
  yandex: [process.env.AUTH_YANDEX_ID, process.env.AUTH_YANDEX_SECRET, process.env.AUTH_YANDEX_ISSUER],
  zitadel: [process.env.AUTH_ZITADEL_ID, process.env.AUTH_ZITADEL_SECRET, process.env.AUTH_ZITADEL_ISSUER],
  zoho: [process.env.AUTH_ZOHO_ID, process.env.AUTH_ZOHO_SECRET, process.env.AUTH_ZOHO_ISSUER],
  zoom: [process.env.AUTH_ZOOM_ID, process.env.AUTH_ZOOM_SECRET, process.env.AUTH_ZOOM_ISSUER],
}

export function setEnvDefaults(config: NextAuthConfig) {
  config.secret ??= process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  config.trustHost ??= !!(process.env.NEXTAUTH_URL ?? process.env.AUTH_TRUST_HOST ?? process.env.VERCEL ?? process.env.NODE_ENV !== "production")
  config.redirectProxyUrl ??= process.env.AUTH_REDIRECT_PROXY_URL
  config.providers = config.providers.map((p) => {
    if (typeof p !== "function") return p
    const provider = p()
    if (provider.type === "oauth" || provider.type === "oidc") {
      const [clientId, clientSecret, issuer] = providersEnv[provider.id] ?? []
      provider.clientId ??= clientId
      provider.clientSecret ??= clientSecret
      provider.issuer ??= issuer
    }
    return provider
  })
}
