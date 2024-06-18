import type { AuthConfig } from "@auth/core"
import { Session } from "@auth/core/types"

/** Configure the {@link QwikAuthConfig} method. */
export interface QwikAuthConfig extends Omit<AuthConfig, "raw"> {}

export type GetSessionResult = Promise<{ data: Session | null; cookie: any }>
