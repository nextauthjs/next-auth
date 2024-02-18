import type { APIEvent } from "@solidjs/start/server"
import { handlers } from "../../../../auth"

const { GET: getHandler, POST: postHandler } = await handlers()

// export { GET, POST }

export async function GET(event: APIEvent) {
  return getHandler(event)
}

export async function POST(event: APIEvent) {
  return postHandler(event)
}
