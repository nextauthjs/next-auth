import { NextApiRequest } from "next"
import { CommonProviderOptions } from "."
import { User, Awaitable } from ".."

export interface CredentialInput {
  label?: string
  type?: string
  value?: string
  placeholder?: string
}

export interface CredentialsConfig<
  C extends Record<string, CredentialInput> = {}
> extends CommonProviderOptions {
  type: "credentials"
  credentials: C
  authorize: (
    credentials: Record<keyof C, string>,
    req: NextApiRequest
  ) => Awaitable<(Omit<User, "id"> | { id?: string }) | null>
}

export type CredentialsProvider = <C extends Record<string, CredentialInput>>(
  options: Partial<CredentialsConfig<C>>
) => CredentialsConfig<C>

export type CredentialsProviderType = "Credentials"

export default function Credentials(
  options: Partial<CredentialsConfig>
): CredentialsConfig {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    options,
  } as any
}
