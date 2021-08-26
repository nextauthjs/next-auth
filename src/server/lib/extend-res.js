/**
 * If the request expects a return URL, send it as a JSON response
 * instead of doing an actual redirect.
 */
export default function extendRes(req, res) {
  res.redirect = (url) => {
    if (req.body?.json === "true") {
      return res.json({ url })
    }
    res.status(302).setHeader("Location", url)
    return res.end()
  }
}
