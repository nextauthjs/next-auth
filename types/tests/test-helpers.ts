import { IncomingMessage, ServerResponse } from "http"
import { Socket } from "net"
import { NextApiRequest } from "next"

export const nextReq: NextApiRequest = Object.assign(
  new IncomingMessage(new Socket()),
  {
    query: {},
    cookies: {},
    body: {},
    env: {},
  }
)
