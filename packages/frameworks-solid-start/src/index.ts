/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth } from '@auth/core'
import type { Provider } from '@auth/core/providers'
import type { AuthAction, AuthConfig, Session } from '@auth/core/types'

export interface SolidAuthConfig extends Omit<AuthConfig, 'providers'> {
  prefix?: string
  providers: Provider<any>[]
}

const actions: AuthAction[] = [
  'providers',
  'session',
  'csrf',
  'signin',
  'signout',
  'callback',
  'verify-request',
  'error',
]

function SolidAuthHandler(prefix: string, authOptions: SolidAuthConfig) {
  return async (event: any) => {
    const { request } = event
    const url = new URL(request.url)
    const action = url.pathname
      .slice(prefix.length + 1)
      .split('/')[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + '/')) {
      return
    }

    return await Auth(request, authOptions)
  }
}

export function SolidAuth(config: SolidAuthConfig) {
  const { prefix = '/api/auth', ...authOptions } = config
  authOptions.basePath ??= prefix
  authOptions.secret ??= process.env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== 'production'
  )
  const handler = SolidAuthHandler(prefix, authOptions)
  return {
    async GET(event: any) {
      return await handler(event)
    },
    async POST(event: any) {
      return await handler(event)
    },
  }
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: Request,
  options: AuthConfig,
  serverResponse?: Response
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true

  const url = new URL('/api/auth/session', req.url)
  const response = await Auth(
    new Request(url, { headers: req.headers }),
    options
  )

  const { status = 200 } = response

  const cookie = response.headers.get('set-cookie')
  if (cookie && serverResponse) {
    serverResponse.headers.append('set-cookie', cookie)
  }

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
