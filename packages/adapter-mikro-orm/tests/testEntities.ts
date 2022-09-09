import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import { randomUUID } from "@next-auth/adapter-test"
import type { defaultEntities } from "../src"
import { Account, Session } from "../src/entities"

@Entity()
export class User implements defaultEntities.User {
  @PrimaryKey()
  @Property({ type: 'string' })
  id: string = randomUUID()

  @Property({ type: 'string', nullable: true })
  name?: string

  @Property({ type: 'string', nullable: true })
  @Unique()
  email?: string

  @Property({ type: "Date", nullable: true })
  emailVerified: Date | null = null

  @Property({ type: 'string', nullable: true })
  image?: string

  @OneToMany({
    entity: () => Session,
    mappedBy: (session) => session.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  sessions = new Collection<Session>(this)

  @OneToMany({
    entity: () => Account,
    mappedBy: (account) => account.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  accounts = new Collection<Account>(this)

  @Property({ type: 'string', hidden: true })
  role = "ADMIN"
}

@Entity()
export class VeryImportantEntity {
  @PrimaryKey()
  @Property({ type: 'string' })
  id: string = randomUUID()

  @Property({ type: 'boolean' })
  important = true
}
