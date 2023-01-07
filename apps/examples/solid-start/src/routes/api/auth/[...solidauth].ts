import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start"
import GitHub from "@auth/core/providers/github"
import { serverEnv } from "~/env/server"

export const authOpts: SolidAuthConfig = {
  providers: [
    // @ts-ignore types are wrong
    GitHub({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
  ],
  debug: false,
}

export const { GET, POST } = SolidAuth(authOpts)
