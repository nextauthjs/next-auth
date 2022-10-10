import type { GetServerSidePropsContext, NextApiRequest } from "next"

export function setCookie(res, value: string) {
  // Preserve any existing cookies that have already been set in the same session
  let setCookieHeader = res.getHeader("Set-Cookie") ?? []
  // If not an array (i.e. a string with a single cookie) convert it into an array
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader]
  }
  setCookieHeader.push(value)
  res.setHeader("Set-Cookie", setCookieHeader)
}

export function getBody(
  req: NextApiRequest | GetServerSidePropsContext["req"]
): { body: RequestInit["body"] } | undefined {
  if (!("body" in req) || !req.body || req.method !== "POST") {
    return
  }

  const contentType = req.headers?.["content-type"]
  if (contentType?.includes("application/json")) {
    return { body: JSON.stringify(req.body) }
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    return { body: new URLSearchParams(req.body) }
  }
}
