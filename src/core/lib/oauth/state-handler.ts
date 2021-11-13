import { generators } from "openid-client"

import type { InternalOptions } from "src/lib/types"
import type { Cookie } from "../cookie"

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/** Returns state if the provider supports it */
export async function createState(
  options: InternalOptions<"oauth">
): Promise<{ cookie: Cookie; value: string } | undefined> {
  const { logger, provider, jwt, cookies } = options

  if (!provider.checks?.includes("state")) {
    // Provider does not support state, return nothing
    return
  }

  const state = generators.state()

  const encodedState = await jwt.encode({
    ...jwt,
    maxAge: STATE_MAX_AGE,
    token: { state },
  })

  logger.debug("CREATE_STATE", { state, maxAge: STATE_MAX_AGE })

  const expires = new Date()
  expires.setTime(expires.getTime() + STATE_MAX_AGE * 1000)
  return {
    value: state,
    cookie: {
      name: cookies.state.name,
      value: encodedState,
      options: { ...cookies.state.options, expires },
    },
  }
}

/**
 * Returns state from if the provider supports states,
 * and clears the container cookie afterwards.
 */
export async function useState(
  state: string | undefined,
  options: InternalOptions<"oauth">
): Promise<{ value: string; cookie: Cookie } | undefined> {
  const { cookies, provider, jwt } = options

  if (!provider.checks?.includes("state") || !state) return

  const value = (await jwt.decode({ ...options.jwt, token: state })) as any

  return {
    value: value?.state ?? undefined,
    cookie: {
      name: cookies.state.name,
      value: "",
      options: { ...cookies.pkceCodeVerifier.options, maxAge: 0 },
    },
  }
}
