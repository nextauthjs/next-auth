import { Schema as S, Models } from "@triplit/db"

export const schema = {
  users: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String({ nullable: true, default: null }),
      email: S.String({ nullable: true, default: null }),
      emailVerified: S.Date({ nullable: true, default: null }),
      image: S.String({ nullable: true, default: null }),
    }),
  },
  accounts: {
    schema: S.Schema({
      id: S.Id(),
      userId: S.String(),
      user: S.RelationById("users", "$userId"),
      type: S.String(),
      provider: S.String(),
      providerAccountId: S.String(),
      refresh_token: S.String({ nullable: true, default: null }),
      access_token: S.String({ nullable: true, default: null }),
      expires_at: S.Number({ nullable: true, default: null }),
      token_type: S.String({ nullable: true, default: null }),
      scope: S.String({ nullable: true, default: null }),
      id_token: S.String({ nullable: true, default: null }),
      session_state: S.String({ nullable: true, default: null }),
    }),
  },
  sessions: {
    schema: S.Schema({
      id: S.Id(),
      userId: S.String(),
      user: S.RelationById("users", "$userId"),
      expires: S.Date(),
      sessionToken: S.String(),
    }),
  },
  verificationTokens: {
    schema: S.Schema({
      id: S.Id(),
      identifier: S.String(),
      token: S.String(),
      expires: S.Date(),
    }),
  },
} satisfies Models<any, any>
