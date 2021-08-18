import { Awaitable, NextApiRequest } from "../internals/utils"
import { CommonProviderOptions } from "."
import { User } from ".."

export interface CredentialInput {
  label?: string
  type?: string
  value?: string
  placeholder?: string
}

export type Credentials = Record<string, CredentialInput>

export interface CredentialsConfig<C extends Credentials = {}>
  extends CommonProviderOptions {
  type: "credentials"
  credentials: C
  authorize(
    credentials: Record<keyof C, string>,
    req: NextApiRequest
  ): Awaitable<(Omit<User, "id"> | { id?: string }) | null>
}

export type CredentialsProvider = <C extends Record<string, CredentialInput>>(
  options: Partial<CredentialsConfig<C>>
) => CredentialsConfig<C>

export type CredentialsProviderType = "Credentials"

declare module "next-auth/providers/credentials" {
  export default function CredentialsProvider<
    C extends Record<string, CredentialInput>
  >(options: Partial<CredentialsConfig<C>>): CredentialsConfig<C>
}
