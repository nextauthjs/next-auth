import type { AuthAction } from "../../types.js"

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

export function isAuthAction(action: string): action is AuthAction {
  return actions.includes(action as AuthAction)
}
