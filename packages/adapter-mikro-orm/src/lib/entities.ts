import {
  Property,
  Unique,
  PrimaryKey,
  Entity,
  OneToMany,
  Collection,
  ManyToOne,
  types,
} from "@mikro-orm/core"

import type {
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken as AdapterVerificationToken,
} from "@auth/core/adapters"

type RemoveIndex<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K]
}

@Entity()
export class User implements RemoveIndex<AdapterUser> {
  @PrimaryKey()
  id: string = crypto.randomUUID()

  @Property({ type: types.string, nullable: true })
  name?: AdapterUser["name"]

  @Property({ type: types.string, nullable: true })
  @Unique()
  email: AdapterUser["email"] = ""

  @Property({ type: types.datetime, nullable: true })
  emailVerified: AdapterUser["emailVerified"] = null

  @Property({ type: types.string, nullable: true })
  image?: AdapterUser["image"]

  @OneToMany({
    entity: "Session",
    mappedBy: (session: Session) => session.user,
    hidden: true,
    orphanRemoval: true,
  })
  sessions = new Collection<Session, object>(this)

  @OneToMany({
    entity: "Account",
    mappedBy: (account: Account) => account.user,
    hidden: true,
    orphanRemoval: true,
  })
  accounts = new Collection<Account, object>(this)
}

@Entity()
export class Session implements AdapterSession {
  @PrimaryKey()
  @Property({ type: types.string })
  id: string = crypto.randomUUID()

  @ManyToOne({
    entity: "User",
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ type: types.string, persist: false })
  userId!: AdapterSession["userId"]

  @Property({ type: "Date" })
  expires!: AdapterSession["expires"]

  @Property({ type: types.string })
  @Unique()
  sessionToken!: AdapterSession["sessionToken"]
}

@Entity()
@Unique({ properties: ["provider", "providerAccountId"] })
export class Account implements RemoveIndex<AdapterAccount> {
  @PrimaryKey()
  @Property({ type: types.string })
  id: string = crypto.randomUUID()

  @ManyToOne({
    entity: "User",
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ type: types.string, persist: false })
  userId!: AdapterAccount["userId"]

  @Property({ type: types.string })
  type!: AdapterAccount["type"]

  @Property({ type: types.string })
  provider!: AdapterAccount["provider"]

  @Property({ type: types.string })
  providerAccountId!: AdapterAccount["providerAccountId"]

  @Property({ type: types.string, nullable: true })
  refresh_token?: AdapterAccount["refresh_token"]

  @Property({ type: types.string, nullable: true })
  access_token?: AdapterAccount["access_token"]

  @Property({ type: types.integer, nullable: true })
  expires_at?: AdapterAccount["expires_at"]

  @Property({ type: types.string, nullable: true })
  token_type?: AdapterAccount["token_type"]

  @Property({ type: types.string, nullable: true })
  scope?: AdapterAccount["scope"]

  @Property({ type: types.text, nullable: true })
  id_token?: AdapterAccount["id_token"]

  @Property({ type: types.string, nullable: true })
  session_state?: AdapterAccount["session_state"]
}

@Entity()
@Unique({ properties: ["token", "identifier"] })
export class VerificationToken implements AdapterVerificationToken {
  @PrimaryKey()
  @Property({ type: types.string })
  token!: AdapterVerificationToken["token"]

  @Property({ type: "Date" })
  expires!: AdapterVerificationToken["expires"]

  @Property({ type: types.string })
  identifier!: AdapterVerificationToken["identifier"]
}
