import type { OAuthConfig, OAuthProvider, OAuthProviderType } from "./oauth"

import type { EmailConfig, EmailProvider, EmailProviderType } from "./email"

import type { EthereumConfig } from "./ethereum"

import type {
  CredentialsConfig,
  CredentialsProvider,
  CredentialsProviderType,
} from "./credentials"

export * from "./oauth"
export * from "./email"
export * from "./ethereum"
export * from "./credentials"

export type ProviderType = "oauth" | "email" | "credentials" | "ethereum"

export interface CommonProviderOptions {
  id: string
  name: string
  type: ProviderType
  options?: Record<string, unknown>
}

export type Provider = OAuthConfig<any> | EmailConfig | CredentialsConfig | EthereumConfig

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
