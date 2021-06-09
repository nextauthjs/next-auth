/**
 * Extends res.{end,json,send} with `done()`,
 * and redirect to support sending url as json.
 *
 * When a response is complete, it will call the `done` method,
 * so that the serverless function knows when it is
 * safe to return and that no more data will be sent.
 */
export default function extendRes (req, res, done) {
  const originalResEnd = res.end.bind(res)
  res.end = (...args) => {
    done()
    return originalResEnd(...args)
  }

  const originalResJson = res.json.bind(res)
  res.json = (...args) => {
    done()
    return originalResJson(...args)
  }

  const originalResSend = res.send.bind(res)
  res.send = (...args) => {
    done()
    return originalResSend(...args)
  }

  res.redirect = (url) => {
    if (req.body?.json === 'true') {
      return res.json({ url })
    }
    res.status(302).setHeader('Location', url)
    return res.end()
  }
}
