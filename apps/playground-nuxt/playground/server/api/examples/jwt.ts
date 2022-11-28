import { getToken } from 'next-auth/jwt'

export default defineEventHandler(async (event) => {
  // @ts-expect-error: cookies property is not present in h3
  event.req.cookies = parseCookies(event)
  const token = await getToken({
    req: event.req
  })
  return token
})
