import {NextApiRequest} from "next"
import {defaultCookies} from "./lib/cookie"

export interface Provider {
  id: string
  name: string
  type: string
  clientId: string
  clientSecret: string
  version?: string
  scope?: string
  accessTokenUrl?: string
  authorizationUrl?: string
  profileUrl?: string
  profile?(profile: {}): Promise<{}>
  verifications?: ("state" | "pkce")[]
}

export interface NextApiRequestWithOptions extends NextApiRequest {
  options: {
    debug?: boolean
    theme?: 'auto' | 'light' | 'dark'
    adapter?: {}
    provider?: Provider
    baseUrl: string
    basePath: string
    secret: string
    cookies: ReturnType<typeof defaultCookies>
    callbackUrl: string
    pages: {}
    jwt: {
      secret: string,
      maxAge: number,
      async encode(): any,
      async decode(): any,
      encryption: boolean
    }
    events: {
      signIn?(): Promise<void>
      signOut?(): Promise<void>
      createUser?(): Promise<void>
      updateUser?(): Promise<void>
      linkAccount?(): Promise<void>
      session?(): Promise<void>
      erro?(): Promise<void>
    }
    callbacks: {
      signIn(): Promise<string | false>
      jwt(): Promise<{}>
      session(): Promise<{}>
      redirect(): Promise<string>
    }
    session: {
      jwt: boolean,
      maxAge: number
      updateAge: number
    }
    csrfToken: string
  }
}