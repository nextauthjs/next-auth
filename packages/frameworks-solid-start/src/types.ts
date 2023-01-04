import { type Session } from "@auth/core/types";
import { type JSX } from "solid-js";
export interface AuthClientConfig {
  baseUrl: string;
  basePath: string;
  baseUrlServer: string;
  basePathServer: string;
  /** Stores last session response */
  _session?: Session | null | undefined;
  /** Used for timestamp since last sycned (in seconds) */
  _lastSync: number;
  /**
   * Stores the `SessionProvider`'s session update method to be able to
   * trigger session updates from places like `signIn` or `signOut`
   */
  _getSession: (...args: any[]) => any;
}

export interface SessionProviderProps {
  children: JSX.Element;
  session?: Session | null;
  baseUrl?: string;
  basePath?: string;
  /**
   * A time interval (in seconds) after which the session will be re-fetched.
   * If set to `0` (default), the session is not polled.
   */
  refetchInterval?: number;
  /**
   * `SessionProvider` automatically refetches the session when the user switches between windows.
   * This option activates this behaviour if set to `true` (default).
   */
  refetchOnWindowFocus?: boolean;
}

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>);

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
   *
   * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
   */
  callbackUrl?: string;
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
  redirect?: boolean;
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export declare type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams;

export interface SignOutParams<R extends boolean = true> {
  /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
  callbackUrl?: string;
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R;
}

export interface UseSessionOptions<R extends boolean> {
  required: R;
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void;
}
