import { InvalidMethodResponse } from "../types"

export const defaultInvalidMethodResponse: InvalidMethodResponse = {
  status: 400,
  body: `Error: Action not supported by NextAuth.js` as any,
}
