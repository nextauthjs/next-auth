import { qwikAuth$ } from "@auth/qwik"
import Github from "@auth/qwik/providers/github"

export const { onRequest, useAuthSession, useAuthSignIn, useAuthSignOut } =
  qwikAuth$(() => ({ providers: [Github] }))
