import * as React from "react"
import { IncomingMessage } from "http"
import { Session } from "."
import { BuiltInProviders, ProviderType } from "./providers"

export interface CtxOrReq {
  req?: IncomingMessage
  ctx?: { req: IncomingMessage }
}

/***************
 * Session types
 **************/

export type GetSessionOptions = CtxOrReq & {
  event?: "storage" | "timer" | "hidden" | string
  triggerEvent?: boolean
}

/** @docs https://next-auth.js.org/getting-started/client#usesession */
export function useSession(): [Session | null, boolean]

/** @docs https://next-auth.js.org/getting-started/client#getsession */
export function getSession(options: GetSessionOptions): Promise<Session | null>

/**
 * Alias for `getSession`
 * @docs https://next-auth.js.org/getting-started/client#getsession
 */
export const session: typeof getSession

/*******************
 * CSRF Token types
 ******************/

/** @docs https://next-auth.js.org/getting-started/client#getcsrftoken */
export function getCsrfToken(ctxOrReq: CtxOrReq): Promise<string | null>

/**
 * Alias for `getCsrfToken`
 * @docs https://next-auth.js.org/getting-started/client#getcsrftoken
 */
export const csrfToken: typeof getCsrfToken

export interface ClientSafeProvider {
  id: string
  name: string
  type: ProviderType
  signinUrl: string
  callbackUrl: string
}

/******************
 * Providers types
 *****************/

/** @docs https://next-auth.js.org/getting-started/client#getproviders */
export function getProviders(): Promise<Record<
  string,
  ClientSafeProvider
> | null>

/**
 * Alias for `getProviders`
 * @docs https://next-auth.js.org/getting-started/client#getproviders
 */
export const providers: typeof getProviders

/****************
 * Sign in types
 ***************/

export type RedirectableProvider = "email" | "credentials"

export type SignInProvider = RedirectableProvider | string | undefined

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Defaults to the current URL.
   * @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
   */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option */
  redirect?: boolean
}

export interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorisationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

/** @docs https://next-auth.js.org/getting-started/client#signin */
export function signIn<P extends SignInProvider = undefined>(
  provider?: P,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorisationParams
): Promise<
  P extends RedirectableProvider ? SignInResponse | undefined : undefined
>

/**
 * Alias for `signIn`
 * @docs https://next-auth.js.org/getting-started/client#signin
 */
export const signin: typeof signIn

/****************
 * Sign out types
 ****************/

/** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
export interface SignOutResponse {
  url: string
}

export interface SignOutParams<R extends boolean = true> {
  /** @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1 */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

/** @docs https://next-auth.js.org/getting-started/client#signout */
export function signOut<R extends boolean = true>(
  params?: SignOutParams<R>
): Promise<R extends true ? undefined : SignOutResponse>

/**
 * @docs https://next-auth.js.org/getting-started/client#signout
 * Alias for `signOut`
 */
export const signout: typeof signOut
/************************
 * SessionProvider types
 ***********************/

/** @docs: https://next-auth.js.org/getting-started/client#options */
export interface SessionProviderOptions {
  baseUrl?: string
  basePath?: string
  clientMaxAge?: number
  keepAlive?: number
}

/** @docs https://next-auth.js.org/getting-started/client#provider */
export type SessionProvider = React.FC<{
  children: React.ReactNode
  session?: Session
  options?: SessionProviderOptions
}>

export const Provider: SessionProvider

/** @docs: https://next-auth.js.org/getting-started/client#options */
export function setOptions(options: SessionProviderOptions): void

/**
 * Alias for `setOptions`
 * @docs: https://next-auth.js.org/getting-started/client#options
 */
export const options: typeof setOptions
