export default function redirect (req, res) {
  // This is the one you will use. The wrapper is just to set it up in src/server/index.
  return function redirect (redirectUrl) {
    const reponseAsJson = !!((req.body && req.body.json === 'true'))
    if (reponseAsJson) {
      res.json({ url: redirectUrl })
    } else {
      if (res.redirect) {
        // Next.js makes it availeble by default https://nextjs.org/docs/api-routes/response-helpers
        res.redirect(redirectUrl)
        return
      } else {
        res.status(302).setHeader('Location', redirectUrl)
        return res.end()
      }
    }
    return res.end()
  }
}
