import type { AuthConfig } from "@auth/core"
import { AuthAction } from "@auth/core/types.js"
import { Session } from "inspector"

/** Configure the {@link QwikAuthConfig} method. */
export interface QwikAuthConfig extends Omit<AuthConfig, "raw"> {}

export type GetSessionResult = Promise<{ data: Session | null; cookie: any }>

export const qwikAuthActions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]
