import * as o from "oauth4webapi"
import type { InternalOptions, RequestInternal } from "../../types.js"
import type { Cookie } from "../cookie.js"
import { InvalidState } from "../errors.js"

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

  const state = o.generateRandomState()
  const maxAge = cookies.state.options.maxAge ?? STATE_MAX_AGE

  const encodedState = await jwt.encode({
    ...jwt,
    maxAge,
    token: { state },
  })

  logger.debug("CREATE_STATE", { state, maxAge })

  const expires = new Date()
  expires.setTime(expires.getTime() + maxAge * 1000)
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
 * Returns state from the saved cookie
 * if the provider supports states,
 * and clears the container cookie afterwards.
 */
export async function useState(
  cookies: RequestInternal["cookies"],
  resCookies: Cookie[],
  options: InternalOptions<"oauth">
): Promise<string | undefined> {
  const { provider, jwt } = options
  if (!provider.checks.includes("state")) return

  const state = cookies?.[options.cookies.state.name]

  if (!state) throw new InvalidState("State was missing from the cookies.")

  // IDEA: Let the user do something with the returned state
  const value = (await jwt.decode({ ...options.jwt, token: state })) as any

  if (!value?.value) throw new InvalidState("Could not parse state cookie.")

  // Clear the state cookie after use
  resCookies.push({
    name: options.cookies.state.name,
    value: "",
    options: { ...options.cookies.state.options, maxAge: 0 },
  })

  return value.value
}
