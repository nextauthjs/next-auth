import { qwikAuth$ } from "@auth/qwik"
import Github from "@auth/qwik/providers/github"

export const { onRequest, useSession, useSignIn, useSignOut } = qwikAuth$(
  () => ({ providers: [Github] })
)
