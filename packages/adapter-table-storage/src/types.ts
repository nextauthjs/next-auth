export const keys = {
  user: "user",
  userById: "userById",
  account: "account",
  accountByUserId: "accountByUserId",
  session: "session",
  sessionByUserId: "sessionByUserId",
  verificationToken: "verificationToken",
}

export interface UserById {
  email: string
}

export interface Account {
  userId: string
}

export interface AccountByUserId {
  [account: string]: string
}

export interface Session {
  expires: Date
  userId: string
}

export interface SessionByUserId {
  sessionToken: string
}

export interface VerificationToken {
  identifier: string
}
