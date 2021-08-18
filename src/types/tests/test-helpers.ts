import { IncomingMessage } from "http"
import { Socket } from "net"
import { NextApiRequest } from "internals/utils"

export const nextReq: NextApiRequest = Object.assign(
  new IncomingMessage(new Socket()),
  {
    query: {},
    cookies: {},
    body: {},
    env: {},
  }
)
