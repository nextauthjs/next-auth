import type { AuthConfig } from "@auth/core"
import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core"

export function setEnvDefaults(config: AuthConfig) {
  try {
    config.secret ??= process.env.AUTH_SECRET
    const url = process.env.AUTH_URL
    if (!url) return
    const { pathname } = new URL(url)
    if (pathname === "/") return
    config.basePath ||= pathname
  } catch {
  } finally {
    config.basePath ||= "/auth"
    coreSetEnvDefaults(process.env, config)
  }
}
