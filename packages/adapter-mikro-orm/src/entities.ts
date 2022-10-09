import { v4 as randomUUID } from "uuid"

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
} from "next-auth/adapters"
import type { ProviderType } from "next-auth/providers"

type RemoveIndex<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K]
}

@Entity()
export class User implements RemoveIndex<AdapterUser> {
  @PrimaryKey()
  id: string = randomUUID()

  @Property({ type: types.string, nullable: true })
  name?: string

  @Property({ type: types.string, nullable: true })
  @Unique()
  email: string = ""

  @Property({ type: types.datetime, nullable: true })
  emailVerified: Date | null = null

  @Property({ type: types.string, nullable: true })
  image?: string

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
  id: string = randomUUID()

  @ManyToOne({
    entity: "User",
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ type: types.string, persist: false })
  userId!: string

  @Property({ type: "Date" })
  expires!: Date

  @Property({ type: types.string })
  @Unique()
  sessionToken!: string
}

@Entity()
@Unique({ properties: ["provider", "providerAccountId"] })
export class Account implements RemoveIndex<AdapterAccount> {
  @PrimaryKey()
  @Property({ type: types.string })
  id: string = randomUUID()

  @ManyToOne({
    entity: "User",
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ type: types.string, persist: false })
  userId!: string

  @Property({ type: types.string })
  type!: ProviderType

  @Property({ type: types.string })
  provider!: string

  @Property({ type: types.string })
  providerAccountId!: string

  @Property({ type: types.string, nullable: true })
  refresh_token?: string

  @Property({ type: types.string, nullable: true })
  access_token?: string

  @Property({ type: types.integer, nullable: true })
  expires_at?: number

  @Property({ type: types.string, nullable: true })
  token_type?: string

  @Property({ type: types.string, nullable: true })
  scope?: string

  @Property({ type: types.text, nullable: true })
  id_token?: string

  @Property({ type: types.string, nullable: true })
  session_state?: string
}

@Entity()
@Unique({ properties: ["token", "identifier"] })
export class VerificationToken implements AdapterVerificationToken {
  @PrimaryKey()
  @Property({ type: types.string })
  token!: string

  @Property({ type: "Date" })
  expires!: Date

  @Property({ type: types.string })
  identifier!: string
}
