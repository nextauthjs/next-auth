export default function redirect (req, res) {
  // This is the one you will use. The wrapper is just to set it up in src/server/index.
  return function redirect (url) {
    const reponseAsJson = req.body?.json === 'true'
    if (reponseAsJson) {
      res.json({ url })
    } else {
      res.status(302).setHeader('Location', url)
    }
    return res.end()
  }
}
