import type { NextAuthRequest, NextAuthResponse } from "src/lib/types"

/**
 * If the request expects a return URL, send it as a JSON response
 * instead of doing an actual redirect.
 */
export default function extendRes(req: NextAuthRequest, res: NextAuthResponse) {
  res.redirect = (url) => {
    if (req.body?.json === "true") {
      res.json({ url })
      return res
    }
    res.status(302).setHeader("Location", url)
    res.end()
    return res
  }
}
