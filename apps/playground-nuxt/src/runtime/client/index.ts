import type { NextAuthClientConfig } from 'next-auth/client/_utils'
import type { Plugin, Ref } from 'vue'
import { ref, reactive, computed, inject, toRefs } from 'vue'
import { BroadcastChannel, apiBaseUrl, fetchData, now } from 'next-auth/client/_utils'
import type { Session } from 'next-auth'
import type {
  BuiltInProviderType,
  RedirectableProviderType
} from 'next-auth/providers'
import type { H3EventContext } from 'h3'
import parseUrl from '../lib/parse-url'
import _logger, { proxyLogger } from '../lib/logger'
import type {
  ClientSafeProvider,
  LiteralUnion,
  SessionProviderProps,
  SignInAuthorizationParams,
  SignInOptions,
  SignInResponse,
  SignOutParams,
  SignOutResponse
} from '../types'

// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.
const __NEXTAUTH: NextAuthClientConfig = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL).origin,
  basePath: parseUrl(process.env.NEXTAUTH_URL).path,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ??
      process.env.NEXTAUTH_URL ??
      process.env.VERCEL_URL
  ).origin,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL
  ).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => {}
}

export interface CtxOrReq {
  req?: H3EventContext['req']
  event?: { req: H3EventContext['req'] }
}

export type GetSessionParams = CtxOrReq & {
  event?: 'storage' | 'timer' | 'hidden' | string
  triggerEvent?: boolean
  broadcast?: boolean
}

const logger = proxyLogger(_logger, __NEXTAUTH.basePath)

const broadcast = BroadcastChannel()

function isServer () {
  return (process as any).server
}

export async function getSession (params?: GetSessionParams) {
  const session = await fetchData<Session>(
    'session',
    __NEXTAUTH,
    logger,
    params
  )
  if (params?.broadcast ?? true) { broadcast.post({ event: 'session', data: { trigger: 'getSession' } }) }

  return session
}

/**
 * Returns the current Cross Site Request Forgery Token (CSRF Token)
 * required to make POST requests (e.g. for signing in and signing out).
 * You likely only need to use this if you are not using the built-in
 * `signIn()` and `signOut()` methods.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getcsrftoken)
 */
export async function getCsrfToken (params?: CtxOrReq) {
  const response = await fetchData<{ csrfToken: string }>(
    'csrf',
    __NEXTAUTH,
    logger,
    params
  )
  return response?.csrfToken
}

/**
 * It calls `/api/auth/providers` and returns
 * a list of the currently configured authentication providers.
 * It can be useful if you are creating a dynamic custom sign in page.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getproviders)
 */
export async function getProviders () {
  return await fetchData<
    Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
  >('providers', __NEXTAUTH, logger)
}

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
export async function signIn<
 P extends RedirectableProviderType | undefined = undefined,
> (
  provider?: LiteralUnion<BuiltInProviderType>,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
): Promise<
 P extends RedirectableProviderType ? SignInResponse | undefined : undefined
> {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}

  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const providers = await getProviders()

  if (!providers) {
    window.location.href = `${baseUrl}/error`
    return
  }

  if (!provider || !(provider in providers)) {
    window.location.href = `${baseUrl}/signin?${new URLSearchParams({
     callbackUrl
   })}`
    return
  }

  const isCredentials = providers[provider].type === 'credentials'
  const isEmail = providers[provider].type === 'email'
  const isSupportingReturn = isCredentials || isEmail

  const signInUrl = `${baseUrl}/${
   isCredentials ? 'callback' : 'signin'
 }/${provider}`

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  const res = await fetch(_signInUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-expect-error: Internal
    body: new URLSearchParams({
      ...options,
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true
    })
  })

  const data = await res.json()

  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes('#')) { window.location.reload() }
    return
  }

  const error = new URL(data.url).searchParams.get('error')

  if (res.ok) { await __NEXTAUTH._getSession({ event: 'storage' }) }

  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url
  } as any
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export async function signOut<R extends boolean = true> (
  options?: SignOutParams<R>
): Promise<R extends true ? undefined : SignOutResponse> {
  const { callbackUrl = window.location.href } = options ?? {}
  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const fetchOptions = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-expect-error: Internal
    body: new URLSearchParams({
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true
    })
  }
  const res = await fetch(`${baseUrl}/signout`, fetchOptions)
  const data = await res.json()

  broadcast.post({ event: 'session', data: { trigger: 'signout' } })

  if (options?.redirect ?? true) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes('#')) { window.location.reload() }
    // @ts-expect-error: Internal
    return
  }

  await __NEXTAUTH._getSession({ event: 'storage' })

  return data
}

export function SessionProviderPlugin (options: SessionProviderProps): Plugin {
  return {
    install (app) {
      const { basePath } = options

      if (basePath) { __NEXTAUTH.basePath = basePath }

      /**
       * If session was `null`, there was an attempt to fetch it,
       * but it failed, but we still treat it as a valid initial value.
       */
      const hasInitialSession = options.session !== undefined

      /** If session was passed, initialize as already synced */
      __NEXTAUTH._lastSync = hasInitialSession ? now() : 0

      if (hasInitialSession) { __NEXTAUTH._session = options.session }

      const session = ref(options.session)

      /** If session was passed, initialize as not loading */
      const loading = ref(!hasInitialSession)

      __NEXTAUTH._getSession = async ({ event } = {}) => {
        try {
          const storageEvent = event === 'storage'
          // We should always update if we don't have a client session yet
          // or if there are events from other tabs/windows
          if (storageEvent || __NEXTAUTH._session === undefined) {
            __NEXTAUTH._lastSync = now()
            __NEXTAUTH._session = await getSession({
              broadcast: !storageEvent
            })
            session.value = __NEXTAUTH._session
            return
          }

          if (
            // If there is no time defined for when a session should be considered
            // stale, then it's okay to use the value we have until an event is
            // triggered which updates it
            !event ||
          // If the client doesn't have a session then we don't need to call
          // the server to check if it does (if they have signed in via another
          // tab or window that will come through as a "stroage" event
          // event anyway)
          __NEXTAUTH._session === null ||
          // Bail out early if the client session is not stale yet
          now() < __NEXTAUTH._lastSync
          ) { return }

          // An event or session staleness occurred, update the client session.
          __NEXTAUTH._lastSync = now()
          __NEXTAUTH._session = await getSession()
          session.value = __NEXTAUTH._session
        } catch (error) {
          logger.error('CLIENT_SESSION_ERROR', error as Error)
        } finally {
          loading.value = false
        }
      }

      __NEXTAUTH._getSession()

      const { refetchOnWindowFocus = true } = options

      // Listen for when the page is visible, if the user switches tabs
      // and makes our tab visible again, re-fetch the session, but only if
      // this feature is not disabled.
      const visibilityHandler = () => {
        if (refetchOnWindowFocus && document.visibilityState === 'visible') { __NEXTAUTH._getSession({ event: 'visibilitychange' }) }
      }

      document.addEventListener('visibilitychange', visibilityHandler, false)

      const unsubscribeFromBroadcast = broadcast.receive(() =>
        __NEXTAUTH._getSession({ event: 'storage' })
      )

      const { refetchInterval } = options
      let refetchIntervalTimer: NodeJS.Timer

      if (refetchInterval) {
        refetchIntervalTimer = setInterval(() => {
          if (__NEXTAUTH._session) { __NEXTAUTH._getSession({ event: 'poll' }) }
        }, refetchInterval * 1000)
      }

      const originalUnmount = app.unmount
      app.unmount = function nextAuthUnmount () {
        document.removeEventListener('visibilitychange', visibilityHandler, false)
        unsubscribeFromBroadcast?.()
        clearInterval(refetchIntervalTimer)
        __NEXTAUTH._lastSync = 0
        __NEXTAUTH._session = undefined
        __NEXTAUTH._getSession = () => {}
        originalUnmount()
      }

      const status = computed(() => loading.value ? 'loading' : session.value ? 'authenticated' : 'unauthenticated')
      const value = reactive({
        data: session,
        status
      })

      app.provide('SessionKey', value)
    }
  }
}

/**
 * Vue Composable that gives you access
 * to the logged in user's session data.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#usesession)
 */
export function useSession (): {
  data: Ref<SessionProviderProps['session']>;
  status: Ref<string>;
  } {
  if (typeof window === 'undefined') {
    return {
      data: ref(null),
      status: ref('loading')
    }
  }

  const value = inject<{
    data: SessionProviderProps['session']
    status: string
  }>('SessionKey')
  if (!value) {
    throw new Error('Could not resolve provided session value')
  }
  const { data, status } = toRefs(value)

  return {
    data,
    status
  }
}
