import { setEnvDefaults as coreSetEnvDefaults, skipCSRFCheck } from "@auth/core"
import { dev, building } from "$app/environment"
import { base } from "$app/paths"
import type { SvelteKitAuthConfig } from "./types"

export function setEnvDefaults(
  envObject: Record<string, string | undefined>,
  config: SvelteKitAuthConfig
) {
  config.trustHost ??= dev
  config.basePath ??= envObject.AUTH_URL ? undefined : `${base}/auth`
  config.skipCSRFCheck = skipCSRFCheck
  if (building) return
  coreSetEnvDefaults(envObject, config)
}
