import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core"
import { dev, building } from "$app/environment"
import { base } from "$app/paths"
import type { SvelteKitAuthConfig } from "./types"

export function setEnvDefaults(envObject: Record<string, string | undefined>, config: SvelteKitAuthConfig) {
  if (building) return
  coreSetEnvDefaults(envObject, config)
  config.trustHost ??= dev
  config.basePath = `${base}/auth`
}

