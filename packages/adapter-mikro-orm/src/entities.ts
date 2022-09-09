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

  @Property({ type: 'string', nullable: true })
  name?: string

  @Property({ type: 'string', nullable: true })
  @Unique()
  email?: string

  @Property({ type: 'Date', nullable: true })
  emailVerified: Date | null = null

  @Property({ type: 'string', nullable: true })
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
  @Property({ type: 'string' })
  id: string = randomUUID()

  @ManyToOne({
    entity: () => User,
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ type: 'string', persist: false })
  userId!: string

  @Property({ type: 'Date' })
  expires!: Date

  @Property({ type: 'string' })
  @Unique()
  sessionToken!: string
}

@Entity()
@Unique({ properties: ["provider", "providerAccountId"] })
export class Account implements RemoveIndex<DefaultAccount> {
  @PrimaryKey()
  @Property({ type: 'string' })
  id: string = randomUUID()

  @ManyToOne({
    entity: () => User,
    hidden: true,
    onDelete: "cascade",
  })
  user!: User

  @Property({ type: 'string', persist: false })
  userId!: string

  @Enum({ type: 'string' })
  type!: ProviderType

  @Property({ type: 'string' })
  provider!: string

  @Property({ type: 'string' })
  providerAccountId!: string

  @Property({ type: 'string', nullable: true })
  refresh_token?: string

  @Property({ type: 'string', nullable: true })
  access_token?: string

  @Property({ type: 'number', nullable: true })
  expires_at?: number

  @Property({ type: 'string', nullable: true })
  token_type?: string

  @Property({ type: 'string', nullable: true })
  scope?: string

  @Property({ type: 'string', nullable: true })
  id_token?: string

  @Property({ type: 'string', nullable: true })
  session_state?: string
}

@Entity()
@Unique({ properties: ["token", "identifier"] })
export class VerificationToken implements AdapterVerificationToken {
  @PrimaryKey()
  @Property({ type: 'string' })
  token!: string

  @Property({ type: 'Date' })
  expires!: Date

  @Property({ type: 'string' })
  identifier!: string
}
