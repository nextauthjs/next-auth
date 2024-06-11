import GitHub from "@auth/core/providers/github"
import { qwikAuth$ } from "@auth/qwik"
import { RequestEvent } from "@builder.io/qwik-city"

export const { onRequest, useAuthSession, useAuthSignIn, useAuthSignOut } =
  qwikAuth$(({ env }: RequestEvent) => ({
    trustHost: true,
    providers: [
      GitHub({
        clientId: env.get("AUTH_GITHUB_ID"),
        clientSecret: env.get("AUTH_GITHUB_SECRET"),
      }),
    ],
  }))
