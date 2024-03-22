import type { AuthConfig } from "../../src/types"

const userProfile = {
  id: "abc",
  name: "Fill Murray",
  email: "fill@murray.com",
  image: "https://source.boringavatars.com/marble",
}

export const authOptions = {
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
      redirectProxyUrl: undefined,
      checks: [],
      account: () => {},
    },
  ],
  basePath: "/auth",
  secret: ["abc"],
  redirectProxyUrl: undefined,
  trustHost: true,
  adapter: undefined,
  logger: {
    error: (msg: Error) => console.error(msg),
  },
  experimental: {},
} satisfies AuthConfig
