import { auth } from "auth"
import { headers } from "next/headers"

export default async function Page() {
  // TODO: Drop when we can move this into `@auth/nextjs` when `next/headers` is universally available for Middleware too
  const $headers = headers() as any
  return <pre>{JSON.stringify(await auth($headers), null, 2)}</pre>
}
