import { v4 as randomUUID } from "uuid"

import {
  Property,
  Unique,
  PrimaryKey,
  Entity,
  Enum,
  OneToMany,
  Collection,
  ManyToOne,
} from "@mikro-orm/core"
import type { DefaultAccount } from "next-auth"
import type {
  AdapterSession,
  AdapterUser,
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

  @Property({ nullable: true })
  name?: string

  @Property({ nullable: true })
  @Unique()
  email?: string

  @Property({ type: "Date", nullable: true })
  emailVerified: Date | null = null

  @Property({ nullable: true })
  image?: string

  @OneToMany({
    entity: () => Session,
    mappedBy: (session) => session.user,
    hidden: true,
    orphanRemoval: true,
  })
  sessions = new Collection<Session>(this)

  @OneToMany({
    entity: () => Account,
    mappedBy: (account) => account.user,
    hidden: true,
    orphanRemoval: true,
  })
  accounts = new Collection<Account>(this)
}

@Entity()
export class Session implements AdapterSession {
  @PrimaryKey()
  id: string = randomUUID()

  @ManyToOne({
    entity: () => User,
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ persist: false })
  userId!: string

  @Property()
  expires!: Date

  @Property()
  @Unique()
  sessionToken!: string
}

@Entity()
@Unique({ properties: ["provider", "providerAccountId"] })
export class Account implements RemoveIndex<DefaultAccount> {
  @PrimaryKey()
  id: string = randomUUID()

  @ManyToOne({
    entity: () => User,
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ persist: false })
  userId!: string

  @Enum()
  type!: ProviderType

  @Property()
  provider!: string

  @Property()
  providerAccountId!: string

  @Property({ nullable: true })
  refresh_token?: string

  @Property({ nullable: true })
  access_token?: string

  @Property({ nullable: true })
  expires_at?: number

  @Property({ nullable: true })
  token_type?: string

  @Property({ nullable: true })
  scope?: string

  @Property({ nullable: true })
  id_token?: string

  @Property({ nullable: true })
  session_state?: string
}

@Entity()
@Unique({ properties: ["token", "identifier"] })
export class VerificationToken implements AdapterVerificationToken {
  @PrimaryKey()
  @Property()
  token!: string

  @Property()
  expires!: Date

  @Property()
  identifier!: string
}
