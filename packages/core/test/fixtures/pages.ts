import { AuthConfig } from "../src"

const userProfile = {
  id: "abc",
  name: "Fill Murray",
  email: "fill@murray.com",
  image: "https://source.boringavatars.com/marble",
}

export const pagesOptions = {
  debug: false,
  pages: {},
  theme: {
    colorScheme: "auto" as const,
    logo: "",
    brandColor: "",
    buttonText: "",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 2592000,
    updateAge: 86400,
    generateSessionToken: () => "abc123",
  },
  providers: [
    {
      id: "github",
      name: "GitHub",
      type: "oauth" as const,
      authorization: `https://github.com/login/oauth/authorize`,
      //   params: { scope: "read:user user:email" },
      // },
      token: `https://github.com/login/oauth/access_token`,
      userinfo: {
        url: `https://github.com/user`,
        async request() {
          return userProfile
        },
      },
      profile: () => userProfile,
      style: { logo: "", bg: "", text: "" },
      clientId: "abc",
      clientSecret: "abc",
      signinUrl: "http://localhost:3000/auth/signin/github",
      callbackUrl: "http://localhost:3000/auth/callback/github",
      redirectProxyUrl: undefined,
      checks: [],
      account: () => {},
    },
  ],
  callbacks: {
    signIn: () => null,
    redirect: () => null,
    session: () => null,
    jwt: () => null,
  },
  basePath: "/auth",
  secret: ["abc"],
  redirectProxyUrl: undefined,
  trustHost: true,
  url: new URL("http://localhost:3000/auth/signin"),
  action: "signout",
  provider: undefined,
  cookies: {
    sessionToken: { name: "authjs.session-token", options: {} },
    callbackUrl: { name: "authjs.callback-url", options: {} },
    csrfToken: { name: "authjs.csrf-token", options: {} },
    pkceCodeVerifier: { name: "authjs.pkce.code_verifier", options: {} },
    state: { name: "authjs.state", options: {} },
    nonce: { name: "authjs.nonce", options: {} },
  },
  jwt: {
    secret: ["abc"],
    maxAge: 2592000,
    encode: async () => {},
    decode: async () => {},
  },
  events: {},
  adapter: undefined,
  logger: {
    error: (msg: string) => console.error(msg),
    warn: (msg: string) => console.warn(msg),
    debug: (msg: string) => console.debug(msg),
  },
  callbackUrl: "http://localhost:3000/",
  isOnRedirectProxy: false,
  experimental: {},
  csrfToken: "abc",
  csrfTokenVerified: undefined,
} satisfies AuthConfig
