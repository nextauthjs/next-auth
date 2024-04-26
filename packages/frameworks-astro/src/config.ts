import type { AuthConfig } from "@auth/core"
import type { APIContext } from "astro"

export function defineConfig(config: AuthConfig): typeof config
export function defineConfig(fn: (context: APIContext) => AuthConfig): typeof fn

export function defineConfig(config: unknown) {
  return config
}
