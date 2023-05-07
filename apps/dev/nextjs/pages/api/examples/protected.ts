// This is an example of to protect an API route
import { auth } from "auth"

export default auth(req, res) => {
  const session = req.auth

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
      session,
    })
  } else {
    res.send({
      error: "You must be sign in to view the protected content on this page.",
    })
  }
}
