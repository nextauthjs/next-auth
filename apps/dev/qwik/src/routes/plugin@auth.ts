import GitHub from "@auth/core/providers/github"
import { qwikAuth$ } from "@auth/qwik"

export const { onRequest, useAuthSession, useAuthSignIn, useAuthSignOut } =
  qwikAuth$(() => ({ providers: [GitHub] }))
