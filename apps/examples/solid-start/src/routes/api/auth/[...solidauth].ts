import { SolidAuth, type SolidAuthConfig } from "@solid-auth/next"
import GitHub from "@auth/core/providers/github"
import { serverEnv } from "~/env/server"
import { type APIEvent } from "solid-start"

export const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
  ],
  debug: false,
}

export const { GET, POST } = SolidAuth(authOpts)
