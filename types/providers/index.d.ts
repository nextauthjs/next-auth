import { OAuthConfig, OAuthProvider, OAuthProviderType } from "./oauth"
export * from "./oauth"

import { EmailConfig, EmailProvider, EmailProviderType } from "./email"
export * from "./email"

import {
  CredentialsConfig,
  CredentialsProvider,
  CredentialsProviderType,
} from "next-auth/providers/credentials"
export * from "./credentials"

export type ProviderType = "oauth" | "email" | "credentials"

export interface CommonProviderOptions {
  id: string
  name: string
  type: ProviderType
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
