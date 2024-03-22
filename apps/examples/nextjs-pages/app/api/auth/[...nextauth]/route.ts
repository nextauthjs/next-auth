// import { handlers } from "../../../auth"
// const { GET, POST } = handlers
//
// const handler = async (req, res) => {
//   const { method, headers, query, body } = req
//   const webRequest = {
//     ...req,
//     headers: new Headers(req.headers),
//     url: new URL(`http://${req.headers["x-forwarded-host"]}${req.url}`),
//   }
//
//   switch (method) {
//     case "GET":
//       res.send(GET(webRequest))
//       break
//     case "POST":
//       res.send(POST(webRequest))
//       break
//   }
// }
//
// export default handler

import { handlers } from "auth"
export const { GET, POST } = handlers
