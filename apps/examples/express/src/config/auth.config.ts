import { AuthConfig } from "@auth/core"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"

export const authConfig: AuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
}
