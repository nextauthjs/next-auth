import { AstroAuth, type AstroAuthConfig } from "@auth/astro"
import GitHub from "@auth/core/providers/github"

export const authOpts: AstroAuthConfig = {
  providers: [
    // @ts-ignore
    GitHub({
      clientId: import.meta.env.GITHUB_ID,
      clientSecret: import.meta.env.GITHUB_SECRET,
    }),
  ],
  trustHost: true,
}

export const { get, post } = AstroAuth(authOpts)
