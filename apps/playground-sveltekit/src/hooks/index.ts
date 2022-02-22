import { getServerSession } from "$lib"
import type { Session } from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

const nextAuthOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    }),
  ],
}

export async function handle({ event, resolve }): Promise<Response> {
  const session = await getServerSession(event.request, nextAuthOptions)
  event.locals.session = session

  return resolve(event)
}

export function getSession(event): Session {
  return event.locals.session || {}
}
