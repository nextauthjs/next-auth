import { handlers } from "../../../auth"
const { GET, POST } = handlers

const handler = async (req, res) => {
  const { method, headers, query, body } = req
  const webRequest = {
    ...req,
    headers: new Headers(req.headers),
  }

  switch (method) {
    case "GET":
      res.send(GET(webRequest))
      break
    case "POST":
      res.send(POST(webRequest))
      break
  }
}

export default handler
