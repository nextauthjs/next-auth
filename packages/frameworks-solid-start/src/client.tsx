/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable solid/reactivity */
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from '@auth/core/providers'
import type { Session } from '@auth/core/types'
import {
  type Resource,
  createContext,
  useContext,
  createResource,
  onMount,
  onCleanup,
  createEffect,
  type JSX,
} from 'solid-js'
import { getRequestEvent, isServer } from 'solid-js/web'
import type {
  SessionProviderProps,
  LiteralUnion,
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
  AuthClientConfig,
} from './types'
import { conditionalEnv, getEnv, now } from './utils'
import { parseUrl } from './utils'

export const __SOLIDAUTH: AuthClientConfig = {
  baseUrl: parseUrl(conditionalEnv('AUTH_URL', 'VERCEL_URL')).origin,
  basePath: parseUrl(getEnv('AUTH_URL')).path,
  baseUrlServer: parseUrl(
    conditionalEnv('AUTH_URL_INTERNAL', 'AUTH_URL', 'VERCEL_URL')
  ).origin,
  basePathServer: parseUrl(conditionalEnv('AUTH_URL_INTERNAL', 'AUTH_URL'))
    .path,
  _lastSync: 0,
  _session: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _getSession: () => {},
}

export const SessionContext = createContext<
  Resource<Session | null> | undefined
>(undefined)

export function createSession(): Resource<Session | null> {
  // @ts-expect-error Satisfy TS if branch on line below
  const value: SessionContextValue<R> = useContext(SessionContext)
  if (!value && (import.meta as any).env.DEV) {
    throw new Error(
      '[@solid-mediakit/auth]: `createSession` must be wrapped in a <SessionProvider />'
    )
  }

  return value
}

const getUrl = (endpoint: string) => {
  if (typeof window === 'undefined') {
    return `${__SOLIDAUTH.baseUrlServer}${endpoint}`
  }
  return endpoint
}

export function SessionProvider(props: SessionProviderProps) {
  const event = getRequestEvent()
  __SOLIDAUTH._session = (event as any)?.locals?.session
  const [session, { refetch }] = createResource(
    async (_, opts: any) => {
      const thisEvent = opts?.refetching?.event
      const storageEvent = thisEvent === 'storage'
      const initEvent = thisEvent === 'init' || thisEvent === undefined
      if (initEvent || storageEvent || __SOLIDAUTH._session === undefined) {
        __SOLIDAUTH._lastSync = now()
        __SOLIDAUTH._session = await getSession(event)
        return __SOLIDAUTH._session
      } else if (
        !thisEvent ||
        __SOLIDAUTH._session === null ||
        now() < __SOLIDAUTH._lastSync
      ) {
        return __SOLIDAUTH._session
      } else {
        __SOLIDAUTH._lastSync = now()
        __SOLIDAUTH._session = await getSession(event)
        return __SOLIDAUTH._session
      }
    },
    {
      initialValue: __SOLIDAUTH._session,
    }
  )

  onMount(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __SOLIDAUTH._getSession = ({ event }) => refetch({ event })

    onCleanup(() => {
      __SOLIDAUTH._lastSync = 0
      __SOLIDAUTH._session = undefined
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      __SOLIDAUTH._getSession = () => {}
    })
  })

  createEffect(() => {
    const { refetchOnWindowFocus = true } = props
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === 'visible')
        __SOLIDAUTH._getSession({ event: 'visibilitychange' })
    }
    document.addEventListener('visibilitychange', visibilityHandler, false)
    onCleanup(() =>
      document.removeEventListener('visibilitychange', visibilityHandler, false)
    )
  })

  return (
    <SessionContext.Provider value={session as any}>
      {props.children}
    </SessionContext.Provider>
  )
}

export async function signIn<
  P extends RedirectableProviderType | undefined = undefined
>(
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { redirectTo = window.location.href, redirect = true } = options ?? {}

  const isCredentials = providerId === 'credentials'
  const isEmail = providerId === 'email'
  const isSupportingReturn = isCredentials || isEmail

  const signInUrl = getUrl(
    `/api/auth/${isCredentials ? 'callback' : 'signin'}/${providerId}`
  )

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  const csrfTokenResponse = await fetch('/api/auth/csrf')
  const { csrfToken } = await csrfTokenResponse.json()

  const res = await fetch(_signInUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    // @ts-expect-error -- ignore
    body: new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl: redirectTo,
    }),
  })

  const data = await res.json()
  if (redirect || !isSupportingReturn) {
    window.location.href = data.url ?? data.redirect ?? redirectTo
    if (data.url.includes('#')) window.location.reload()
    return
  }
  const error = data.url ? new URL(data.url).searchParams.get('error') : null
  if (res.ok && !error) {
    await __SOLIDAUTH._getSession({ event: 'storage' })
  }
  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  } as const
}

export async function signOut(options?: SignOutParams) {
  const { redirectTo = window.location.href, redirect } = options ?? {}
  const csrfTokenResponse = await fetch('/api/auth/csrf')
  const { csrfToken } = await csrfTokenResponse.json()
  const res = await fetch(getUrl(`/api/auth/signout`), {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl: redirectTo,
    }),
  })
  const data = await res.json()
  if (redirect) {
    const url = data.url ?? data.redirect ?? redirectTo
    window.location.href = url
    if (url.includes('#')) window.location.reload()
  }
  await __SOLIDAUTH._getSession({ event: 'storage' })
  return data
}

export const getSession = async (
  event?: ReturnType<typeof getRequestEvent>
) => {
  let reqInit: RequestInit | undefined
  if (isServer && event?.request) {
    const cookie = event.request.headers.get('cookie')
    if (cookie) {
      reqInit = {
        headers: {
          cookie,
        },
      }
    }
  }
  const res = await fetch(getUrl(`/api/auth/session`), reqInit)
  if (isServer && event?.request && (event as any)?.response) {
    const cookie = res.headers.get('set-cookie')
    if (cookie) {
      try {
        ;(event as any).response.headers.append('set-cookie', cookie ?? '')
      } catch (e) {
        // console.log('spcasfafError: ', e)
      }
    }
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  if (!data) return null
  if (Object.keys(data).length === 0) return null
  return data
}

export type ProtectedComponent = (session$: Session) => JSX.Element
