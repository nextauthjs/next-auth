/**
 * [Vercel Skew Protection](https://vercel.com/docs/skew-protection) does not automatically
 * pin custom `fetch()` calls. Next.js sets `globalThis.NEXT_DEPLOYMENT_ID` from `data-dpl-id`
 * on the document; we also fall back to Vercel/Next deployment id env vars when available.
 */

const DEPLOYMENT_ID_HEADER = "x-deployment-id"

function isSkewProtectionEnabled(): boolean {
  if (typeof process === "undefined") return true
  const flag = process.env.VERCEL_SKEW_PROTECTION_ENABLED
  return flag === undefined || flag === "1"
}

export function resolveDeploymentIdForSkewProtection(): string | undefined {
  if (typeof globalThis !== "undefined") {
    const fromGlobal = (globalThis as Record<string, unknown>)
      .NEXT_DEPLOYMENT_ID
    if (typeof fromGlobal === "string" && fromGlobal.length > 0) {
      return fromGlobal
    }
  }
  if (typeof document !== "undefined") {
    const fromDataset = document.documentElement?.dataset?.dplId
    if (fromDataset) return fromDataset
    const fromAttr =
      document.documentElement?.getAttribute("data-dpl-id") ?? undefined
    if (fromAttr) return fromAttr
  }
  if (typeof process !== "undefined") {
    if (process.env.VERCEL_DEPLOYMENT_ID) {
      return process.env.VERCEL_DEPLOYMENT_ID
    }
    if (process.env.NEXT_DEPLOYMENT_ID) {
      return process.env.NEXT_DEPLOYMENT_ID
    }
  }
  return undefined
}

/**
 * Header entries to merge into client-side Auth.js fetches so they stay pinned during
 * rolling releases on Vercel.
 */
export function getSkewProtectionHeaderInit(): Record<string, string> {
  if (!isSkewProtectionEnabled()) return {}
  const deploymentId = resolveDeploymentIdForSkewProtection()
  if (!deploymentId) return {}
  return { [DEPLOYMENT_ID_HEADER]: deploymentId }
}
