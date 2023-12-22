// This work is needed as workaround to Drizzle truncating millisecond precision.
// https://github.com/drizzle-team/drizzle-orm/pull/668

import { randomUUID } from "utils/adapter"

const emailVerified = new Date()
emailVerified.setMilliseconds(0)

const ONE_WEEK_FROM_NOW = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
ONE_WEEK_FROM_NOW.setMilliseconds(0)
const FIFTEEN_MINUTES_FROM_NOW = new Date(Date.now() + 15 * 60 * 1000)
FIFTEEN_MINUTES_FROM_NOW.setMilliseconds(0)

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30
const ONE_MONTH_FROM_NOW = new Date(Date.now() + ONE_MONTH)
ONE_MONTH_FROM_NOW.setMilliseconds(0)

export const fixtures = {
  user: {
    email: "fill@murray.com",
    image: "https://www.fillmurray.com/460/300",
    name: "Fill Murray",
    emailVerified,
  },
  session: {
    sessionToken: randomUUID(),
    expires: ONE_WEEK_FROM_NOW,
  },
  sessionUpdateExpires: ONE_MONTH_FROM_NOW,
  verificationTokenExpires: FIFTEEN_MINUTES_FROM_NOW,
  account: {
    provider: "github",
    providerAccountId: randomUUID(),
    type: "oauth",
    access_token: randomUUID(),
    expires_at: ONE_MONTH / 1000,
    id_token: randomUUID(),
    refresh_token: randomUUID(),
    token_type: "bearer",
    scope: "user",
    session_state: randomUUID(),
  },
}
