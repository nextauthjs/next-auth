import type { AuthConfig } from "@auth/core"
import type { BuiltInProviderType } from "@auth/core/providers"
import type { Session } from "@auth/core/types"

/** Configure the {@link SvelteKitAuth} method. */
export interface SolidAuthConfig extends Omit<AuthConfig, "raw"> { }

// declare module "@solidjs/start/server" {
declare global {
  interface RequestEventLocals {
    auth(): Promise<Session | null>
    /** @deprecated Use `auth` instead. */
    getSession(): Promise<Session | null>
    signIn: <
      P extends BuiltInProviderType | (string & NonNullable<unknown>),
      R extends boolean = true,
    >(
      /** Provider to sign in to */
      provider?: P, // See: https://github.com/microsoft/TypeScript/issues/29729
      options?:
        | FormData
        | ({
          /** The URL to redirect to after signing in. By default, the user is redirected to the current page. */
          redirectTo?: string
          /** If set to `false`, the `signIn` method will return the URL to redirect to instead of redirecting automatically. */
          redirect?: R
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } & Record<string, any>),
      authorizationParams?:
        | string[][]
        | Record<string, string>
        | string
        | URLSearchParams
    ) => Promise<
      R extends false
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
      : never
    >
    signOut: <R extends boolean = true>(options?: {
      /** The URL to redirect to after signing out. By default, the user is redirected to the current page. */
      redirectTo?: string
      /** If set to `false`, the `signOut` method will return the URL to redirect to instead of redirecting automatically. */
      redirect?: R
    }) => Promise<
      R extends false
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
      : never
    >
  }
  interface PageData {
    session?: Session | null
  }
}
