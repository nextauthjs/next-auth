// Minimum TypeScript Version: 3.8

interface Providers {
  Email: Email;
  Credentials: Credentials;
  Apple: Apple;
  Twitter: Twitter;
  Facebook: Facebook;
  Github: Github;
  Slack: Slack;
  Google: Google;
  Auth0: Auth0;
  IdentityServer4: IdentityServer4;
  Discord: Discord;
  Twitch: Twitch;
  Mixer: Mixer;
  Okta: Okta;
}

type PossibleProviders =
  | Email
  | Credentials
  | Apple
  | Twitter
  | Facebook
  | Github
  | Slack
  | Google
  | Auth0
  | IdentityServer4
  | Discord
  | Twitch
  | Mixer
  | Okta;

declare const Providers: Providers;
export default Providers;
export type { PossibleProviders };

/**
 * Email
 */
type Email = (options: ProviderEmailOptions) => void;

interface ProviderEmailOptions {
  server: string | ProviderEmailServer;
  from: string;
}

interface ProviderEmailServer {
  host: string;
  port: string;
  auth: ProviderEmailAuth;
}

interface ProviderEmailAuth {
  user: string;
  pass: string;
}

/**
 * Credentials
 */
type Credentials = (options: ProviderCredentialsOptions) => void;

interface ProviderCredentialsOptions {
  authorizes(credentials: ProviderCredentialsObject): Promise<ProviderCredentialsObject>;
}

interface ProviderCredentialsObject {
  [name: string]: unknown;
}

/**
 * Apple
 */
type Apple = (options: ProviderAppleOptions) => void;

interface ProviderAppleOptions {
  clientId: string;
  clientSecret: ProviderAppleSecret;
}

interface ProviderAppleSecret {
  appleId: string;
  teamId: string;
  privateKey: string;
  keyId: string;
}

/**
 * Twitter
 */
type Twitter = (options: ProviderTwitterOptions) => void;

interface ProviderTwitterOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Facebook
 */
type Facebook = (options: ProviderFacebookOptions) => void;

interface ProviderFacebookOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Github
 */
type Github = (options: ProviderGithubOptions) => void;

interface ProviderGithubOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Slack
 */
type Slack = (options: ProviderSlackOptions) => void;

interface ProviderSlackOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Google
 */
type Google = (options: ProviderGoogleOptions) => void;

interface ProviderGoogleOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Auth0
 */
type Auth0 = (options: ProviderAuth0Options) => void;

interface ProviderAuth0Options {
  clientId: string;
  clientSecret: string;
  subdomain: string;
}

/**
 * IS4
 */

type IdentityServer4 = (options: ProviderIS4Options) => void;

interface ProviderIS4Options {
  id: 'identity-server4';
  name: 'IdentityServer4';
  scope: string;
  domain: string;
  clientId: string;
  clientSecret: string;
}

/**
 * Discord
 */
type Discord = (options: ProviderDiscordOptions) => void;

interface ProviderDiscordOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Twitch
 */
type Twitch = (options: ProviderTwitchOptions) => void;

interface ProviderTwitchOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Mixer
 */
type Mixer = (options: ProviderMixerOptions) => void;

interface ProviderMixerOptions {
  clientId: string;
  clientSecret: string;
}

/**
 * Okta
 */
type Okta = (options: ProviderOktaOptions) => void;

interface ProviderOktaOptions {
  clientId: string;
  clientSecret: string;
  domain: string;
}
