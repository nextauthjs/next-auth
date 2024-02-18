import { SolidAuth } from "@auth/solid-start"
import GitHub from "@auth/solid-start/providers/github"

export const { signIn, signOut, handlers } = SolidAuth({
  debug: true,
  providers: [GitHub],
})
