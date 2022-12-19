import type { OAuthConfig, OAuthProvider, OAuthProviderType } from "./oauth.js"
import type { EmailConfig, EmailProvider, EmailProviderType } from "./email.js"
import type {
  CredentialsConfig,
  CredentialsProvider,
  CredentialsProviderType,
} from "./credentials.js"

export * from "./credentials.js"
export * from "./email.js"
export * from "./oauth.js"

export type ProviderType = "oidc" | "oauth" | "email" | "credentials"

export interface CommonProviderOptions {
  id: string
  name: string
  type: ProviderType
  options?: Record<string, unknown>
}

export type Provider = OAuthConfig<any> | EmailConfig | CredentialsConfig

export type BuiltInProviders = Record<OAuthProviderType, OAuthProvider> &
  Record<CredentialsProviderType, CredentialsProvider> &
  Record<EmailProviderType, EmailProvider>

export type AppProviders = Array<
  Provider | ReturnType<BuiltInProviders[keyof BuiltInProviders]>
>

export interface AppProvider extends CommonProviderOptions {
  signinUrl: string
  callbackUrl: string
}

export type RedirectableProviderType = "email" | "credentials"

export type BuiltInProviderType = RedirectableProviderType | OAuthProviderType
