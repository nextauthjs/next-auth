import { format } from "../src"

// `from` now requires formatting options; These are what would be provided
// with the standard schema definitions
const defaultFromFormat = {
  dynamoKeys: ["pk", "sk", "GSI1PK", "GSI1SK"],
  EntityTagName: "type",
  EntityTags: {
    user: "USER",
    account: "ACCOUNT",
    session: "SESSION",
    vt: "VT",
  },
}

export const from = format.from(defaultFromFormat)
