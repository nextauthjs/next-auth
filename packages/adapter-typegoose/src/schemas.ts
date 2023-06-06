import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { Exclude, Expose, Type } from "class-transformer"
import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import type { ProviderType } from "next-auth/providers"

@Exclude()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class BaseSchema extends TimeStamps {
  @Expose()
  id!: string

  @Exclude()
  __v!: number

  @Exclude()
  createdAt!: Date

  @Exclude()
  updatedAt!: Date
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@Exclude()
export class AccountSchema extends BaseSchema implements AdapterAccount {
  @prop({ required: true })
  @Expose()
  userId!: string

  @prop({ required: true })
  @Expose()
  providerAccountId!: string

  @prop({ required: true })
  @Expose()
  provider!: string

  @prop({ required: true })
  @Expose()
  type!: ProviderType

  @prop({ required: false, default: undefined })
  @Expose()
  access_token?: string

  @prop({ required: false, default: undefined })
  @Expose()
  token_type?: string

  @prop({ required: false, default: undefined })
  @Expose()
  id_token?: string

  @prop({ required: false, default: undefined })
  @Expose()
  refresh_token?: string

  @prop({ required: false, default: undefined })
  @Expose()
  scope?: string

  @prop({ required: false, default: undefined })
  @Expose()
  expires_at?: number

  @prop({ required: false, default: undefined })
  @Expose()
  session_state?: string;

  [x: string]: unknown
}

@Exclude()
export class SessionSchema extends BaseSchema implements AdapterSession {
  @prop({ required: true })
  @Expose()
  userId!: string

  @prop({ required: true })
  @Expose()
  sessionToken!: string

  @prop({ required: true })
  @Expose()
  expires!: Date
}

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

@Exclude()
export class VerificationTokenSchema
  extends BaseSchema
  implements VerificationToken
{
  @Exclude()
  id!: string

  @prop({ required: true })
  @Expose()
  identifier!: string

  @prop({ required: true })
  @Expose()
  @Type(() => Date)
  expires!: Date

  @prop({ required: true })
  @Expose()
  token!: string
}
