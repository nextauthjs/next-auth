import { handlers } from "../../../auth"
const { GET, POST } = handlers

const handler = async (req, res) => {
  const { method, headers, query, body } = req

  switch (method) {
    case "GET":
      GET(req)
      break
    case "POST":
      POST(req)
      break
  }
}

export default handler
