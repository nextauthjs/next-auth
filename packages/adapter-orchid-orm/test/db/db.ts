import { orchidORM } from "orchid-orm"
import { config } from "./config"
import {
  AccountTable,
  SessionTable,
  UserTable,
  VerificationTokenTable,
} from "./tables"

export const db = orchidORM(
  { databaseURL: config.databaseUrl },
  {
    user: UserTable,
    account: AccountTable,
    session: SessionTable,
    verificationToken: VerificationTokenTable,
  }
)
