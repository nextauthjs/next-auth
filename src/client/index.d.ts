import * as React from 'react'
import { GetServerSidePropsContext } from 'next'

interface DefaultSession {
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  expires: Date | string
}

interface BroadcastMessage {
  event?: 'session'
  data?: {
    trigger?: 'signout' | 'getSession'
  }
  clientId: string
  timestamp: number
}

type GetSession<S extends Record<string, unknown> = DefaultSession> = (options: {
  ctx?: GetServerSidePropsContext
  req?: GetServerSidePropsContext['req']
  event?: 'storage' | 'timer' | 'hidden' | string
  triggerEvent?: boolean
}) => Promise<S>

export interface NextAuthConfig {
  baseUrl: string
  basePath: string
  /** 0 means disabled (don't send); 60 means send every 60 seconds */
  keepAlive: number
  /** 0 means disabled (only use cache); 60 means sync if last checked > 60 seconds ago */
  clientMaxAge: number
  /** Used for timestamp since last sycned (in seconds) */
  _clientLastSync: number
  /** Stores timer for poll interval */
  _clientSyncTimer: ReturnType<typeof setTimeout>
  /** Tracks if event listeners have been added */
  _eventListenersAdded: boolean
  /** Stores last session response from hook */
  _clientSession: DefaultSession | null | undefined
  /** Used to store to function export by getSession() hook */
  _getSession: any
}

export type GetCsrfToken = (
  ctxOrReq: GetServerSidePropsContext & GetServerSidePropsContext['req']
) => Promise<string | null>

export interface SessionOptions {
  baseUrl?: string
  basePath?: string
  clientMaxAge?: number
  keepAlive?: number
}

export type Provider<S extends Record<string, unknown> = DefaultSession > = (options: {
  children: React.ReactNode
  session: S
  options: SessionOptions
}) => React.ReactNode

export type SetOptions = (options: SessionOptions) => void

export type SessionContext = React.createContext<[DefaultSession | null, boolean]>

export type UseSession = () => [any, boolean]

export type GetProviders = () => Promise<any[]>

// Sign in types

export interface SignInOptions {
  /** Defaults to the current URL. */
  callbackUrl?: string
  redirect?: boolean
}
export interface SignInResponse {
  error: string | null
  status: number
  ok: boolean
  url: string | null
}

export type SignIn<AuthorizationParams = Record<string, string>> = (
  provider?: string,
  options?: SignInOptions,
  authorizationParams?: AuthorizationParams
) => SignInResponse

// Sign out types

interface SignOutResponse<RedirectType extends boolean=true> {
  /** Defaults to the current URL. */
  callbackUrl?: string
  redirect?: RedirectType
}

export type SignOut<RedirectType extends boolean = true> = (params: SignOutResponse<RedirectType>) => RedirectType extends true ? Promise<{url?: string} | undefined> : undefined
