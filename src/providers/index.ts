import { OAuthConfig, OAuthProvider, OAuthProviderType } from "./oauth"

import { EmailConfig, EmailProvider, EmailProviderType } from "./email"

import {
  CredentialsConfig,
  CredentialsProvider,
  CredentialsProviderType,
} from "./credentials"

export * from "./oauth"
export * from "./email"
export * from "./credentials"

export type ProviderType = "oauth" | "email" | "credentials"

export interface CommonProviderOptions {
  id: string
  name: string
  type: ProviderType
  options?: Record<string, unknown>
}

export type Provider = OAuthConfig | EmailConfig | CredentialsConfig

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
