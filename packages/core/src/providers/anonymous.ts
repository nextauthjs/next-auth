import { CommonProviderOptions } from "./index.js"

export interface AnonymousConfig extends CommonProviderOptions {
  id: string
  type: "anonymous"
  maxAge?: number
  /** Used to hash the verification token. */
  secret?: string
  options?: AnonymousUserConfig
}

export type AnonymousUserConfig = Omit<
  Partial<AnonymousConfig>,
  "options" | "type"
>

export default function AnonymousProvider(
  config: AnonymousUserConfig
): AnonymousConfig {
  return {
    id: "anonymous",
    type: "anonymous",
    name: "Anonymous",
    maxAge: 60 * 24 * 60 * 60,
    options: config,
  }
}
