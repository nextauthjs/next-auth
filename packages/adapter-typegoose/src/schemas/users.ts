import type { AdapterUser } from "next-auth/adapters"
import { prop } from "@typegoose/typegoose"
import { Exclude, Expose, Type } from "class-transformer"
import { SessionSchema } from "./sessions"
import { AccountSchema } from "./accounts"
import { BaseSchema } from "./base"

@Exclude()
export class UserSchema extends BaseSchema implements AdapterUser {
  @prop({ required: false, default: null })
  @Expose()
  name?: string | null

  @prop({ required: true, unique: true })
  @Expose()
  email!: string

  @prop({ required: false, default: null })
  @Expose()
  image?: string | null

  @prop({ required: false, default: null })
  @Expose()
  emailVerified!: Date | null

  @prop({ required: true, default: [] })
  @Type(() => SessionSchema)
  @Exclude()
  sessions!: SessionSchema[]

  @prop({ required: true, default: [] })
  @Type(() => AccountSchema)
  @Exclude()
  accounts!: AccountSchema[]
}
