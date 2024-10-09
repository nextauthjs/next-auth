import {
  AdapterAccount,
  type AdapterAccountType,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters"
import { Entity, Fields, Relations, Validators } from "remult"

@Entity("users", {})
export class User implements AdapterUser {
  @Fields.string()
  id!: string

  @Fields.string<User>({
    validate: [Validators.required(), Validators.unique()],
  })
  email!: string

  @Fields.date({ allowNull: true })
  emailVerified!: Date | null

  @Fields.string({ allowNull: true })
  name?: string | null | undefined

  @Fields.string({ allowNull: true })
  image?: string | null | undefined

  @Relations.toMany<User, Account>(() => Account, "userId")
  accounts!: Account[]

  @Relations.toMany<User, Session>(() => Session, "userId")
  sessions!: Session[]
}

// FIXME
@Entity<Account>("accounts", {
  // id: {
  //   provider: true,
  //   providerAccountId: true,
  // },
})
// @ts-ignore
export class Account implements AdapterAccount {
  // [key: string]: any
  @Fields.cuid()
  id!: string

  @Fields.string()
  userId!: string

  // @Relations.toOne<Account, User>(() => User, "userId")
  // user!: User

  @Fields.string()
  type!: AdapterAccountType

  @Fields.string()
  provider!: string

  @Fields.string()
  providerAccountId!: string

  @Fields.string({ allowNull: true })
  refresh_token?: string

  @Fields.string({ allowNull: true })
  access_token?: string

  @Fields.integer({ allowNull: true })
  expires_at?: number

  @Fields.string({ allowNull: true })
  token_type?: Lowercase<string> | undefined

  @Fields.string({ allowNull: true })
  scope?: string

  @Fields.string({ allowNull: true })
  id_token?: string

  @Fields.string({ allowNull: true })
  session_state?: string
}

@Entity("sessions", {})
export class Session implements AdapterSession {
  @Fields.string()
  id!: string

  @Fields.string({ validate: [Validators.unique()] })
  sessionToken!: string

  @Fields.string()
  userId!: string

  // @Relations.toOne<Session, User>(() => User, "userId")
  // user!: User

  @Fields.date()
  expires!: Date
}

@Entity<VerificationToken>("verification_tokens", {
  id: {
    identifier: true,
    token: true,
  },
})
export class VerificationToken {
  @Fields.string({})
  identifier!: string

  @Fields.string()
  token!: string

  @Fields.date()
  expires!: Date
}

@Entity<Authenticator>("authenticators", {
  id: {
    credentialID: true,
    userId: true,
  },
})
export class Authenticator {
  @Fields.string({ validate: [Validators.unique()] })
  credentialID!: string

  @Fields.string()
  userId!: string

  @Fields.string()
  providerAccountId!: string

  @Fields.string()
  credentialPublicKey!: string

  @Fields.integer()
  counter!: number

  @Fields.string()
  credentialDeviceType!: string

  @Fields.boolean()
  credentialBackedUp!: boolean

  @Fields.string({ allowNull: true })
  transports?: string | null | undefined

  // @Relations.toOne<Authenticator, User>(() => User, "userId")
  // user!: User
}
