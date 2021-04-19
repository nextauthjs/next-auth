import Providers, { OAuthConfig } from "next-auth/providers"
import {
  Adapter,
  EmailAppProvider,
  Profile,
  Session,
  VerificationRequest,
} from "next-auth/adapters"
import NextAuth, * as NextAuthTypes from "next-auth"
import { IncomingMessage, ServerResponse } from "http"
import * as JWTType from "next-auth/jwt"
import { Socket } from "net"
import { NextApiRequest, NextApiResponse } from "internals/utils"
import { AppOptions } from "internals"
import { AppProvider } from "internals/providers"

const req: NextApiRequest = Object.assign(new IncomingMessage(new Socket()), {
  query: {},
  cookies: {},
  body: {},
  env: {},
})

const res: NextApiResponse = Object.assign(new ServerResponse(req), {
  send: (body: string) => undefined,
  json: (body: string) => undefined,
  status: (code: number) => res,
  redirect: (statusOrUrl: number | string, url?: string) => res as any,
  setPreviewData: (data: object | string) => res,
  clearPreviewData: () => res,
})

const pageOptions = {
  signin: "path/to/signin",
  signout: "path/to/signout",
  error: "path/to/error",
  verifyRequest: "path/to/verify",
  newUsers: "path/to/signup",
}

const simpleConfig = {
  providers: [
    Providers.GitHub({
      clientId: "123",
      clientSecret: "123",
      scope:
        "user public_repo repo repo_deployment repo:status read:repo_hook read:org read:public_key read:gpg_key",
    }),
  ],
}

const exampleUser: NextAuthTypes.User = {
  name: "",
  image: "",
  email: "",
}

const exampleSession: Session = {
  userId: "",
  accessToken: "",
  sessionToken: "",
  expires: new Date(),
}

const exampleVerificatoinRequest: VerificationRequest = {
  identifier: "",
  token: "",
  expires: new Date(),
}

const adapter: Adapter<
  NextAuthTypes.User,
  Profile,
  Session,
  VerificationRequest
> = {
  async getAdapter(appOptions: AppOptions) {
    return {
      createUser: async (profile: Profile) => exampleUser,
      getUser: async (id: string) => exampleUser,
      getUserByEmail: async (email: string) => exampleUser,
      getUserByProviderAccountId: async (
        providerId: string,
        providerAccountId: string
      ) => exampleUser,
      updateUser: async (user: NextAuthTypes.User) => exampleUser,
      linkAccount: async (
        userId: string,
        providerId: string,
        providerType: string,
        providerAccountId: string,
        refreshToken: string,
        accessToken: string,
        accessTokenExpires: number
      ) => undefined,
      createSession: async (user: NextAuthTypes.User) => exampleSession,
      getSession: async (sessionToken: string) => exampleSession,
      updateSession: async (session: Session, force?: boolean) =>
        exampleSession,
      deleteSession: async (sessionToken: string) => undefined,
      createVerificationRequest: async (
        email: string,
        url: string,
        token: string,
        secret: string,
        provider: EmailAppProvider,
        options: AppOptions
      ) => exampleVerificatoinRequest,
      getVerificationRequest: async (
        email: string,
        verificationToken: string,
        secret: string,
        provider: AppProvider
      ) => exampleVerificatoinRequest,
      deleteVerificationRequest: async (
        email: string,
        verificationToken: string,
        secret: string,
        provider: AppProvider
      ) => undefined,
    }
  },
}

const allConfig = {
  providers: [
    Providers.Twitter({
      clientId: "123",
      clientSecret: "123",
    }),
  ],
  database: "path/to/db",
  debug: true,
  secret: "my secret",
  session: {
    jwt: true,
    maxAge: 365,
    updateAge: 60,
  },
  jwt: {
    secret: "secret-thing",
    maxAge: 365,
    encryption: true,
    signingKey: "some-key",
    encryptionKey: "some-key",
    encode: async () => "foo",
    decode: async () => ({}),
  },
  pages: pageOptions,
  callbacks: {
    async signIn(
      user: NextAuthTypes.User,
      account: Record<string, unknown>,
      profile: Record<string, unknown>
    ) {
      return true
    },
    async redirect(url: string, baseUrl: string) {
      return "path/to/foo"
    },
    async session(
      session: NextAuthTypes.Session,
      userOrToken: NextAuthTypes.User
    ) {
      return { ...session }
    },
    async jwt(
      token: JWTType.JWT,
      user?: NextAuthTypes.User,
      account?: Record<string, unknown>,
      profile?: Record<string, unknown>,
      isNewUser?: boolean
    ) {
      return token
    },
  },
  events: {
    async signIn(message: string) {
      return undefined
    },
    async signOut(message: string) {
      return undefined
    },
    async createUser(message: string) {
      return undefined
    },
    async linkAccount(message: string) {
      return undefined
    },
    async session(message: string) {
      return undefined
    },
    async error(message: string) {
      return undefined
    },
  },
  adapter,
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: true as true,
        path: "/",
        secure: true,
        domain: "foo.com",
      },
    },
  },
}

const customProvider: OAuthConfig<{
  id: string
  name: string
  email: string
  picture: string
}> = {
  id: "google",
  name: "Google",
  type: "oauth",
  version: "2.0",
  scope:
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  params: { grant_type: "authorization_code" },
  accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
  requestTokenUrl: "https://accounts.google.com/o/oauth2/auth",
  authorizationUrl:
    "https://accounts.google.com/o/oauth2/auth?response_type=code",
  profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
  async profile(profile, tokens) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    }
  },
  clientId: "",
  clientSecret: "",
}

const customProviderConfig = {
  providers: [customProvider],
}

// $ExpectType void | Promise<void>
NextAuth(simpleConfig)

// $ExpectType void | Promise<void>
NextAuth(allConfig)

// $ExpectType void | Promise<void>
NextAuth(customProviderConfig)

// $ExpectType void | Promise<void>
NextAuth(req, res, simpleConfig)

// $ExpectType void | Promise<void>
NextAuth(req, res, allConfig)
