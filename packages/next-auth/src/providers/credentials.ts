import type { RequestInternal } from "../core"
import type { CommonProviderOptions } from "."
import type { User, Awaitable } from ".."

export interface CredentialInput {
  label?: string
  type?: string
  value?: string
  placeholder?: string
}

export interface CredentialsConfig<
  C extends Record<string, CredentialInput> = Record<string, CredentialInput>
> extends CommonProviderOptions {
  type: "credentials"
  credentials: C
  authorize: (
    credentials: Record<keyof C, string> | undefined,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
  ) => Awaitable<User | null>
}

export type CredentialsProvider = <C extends Record<string, CredentialInput>>(
  options: Partial<CredentialsConfig<C>>
) => CredentialsConfig<C>

export type CredentialsProviderType = "Credentials"

type UserCredentialsConfig<C extends Record<string, CredentialInput>> = Partial<
  Omit<CredentialsConfig<C>, "options">
> &
  Pick<CredentialsConfig<C>, "authorize" | "credentials">

export default function Credentials<
  C extends Record<string, CredentialInput> = Record<string, CredentialInput>
>(options: UserCredentialsConfig<C>): CredentialsConfig<C> {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {} as any,
    authorize: () => null,
    options,
  }
}
