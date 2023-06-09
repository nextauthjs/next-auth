import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { Exclude, Expose, Type } from "class-transformer"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

@Exclude()
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class BaseSchema extends TimeStamps implements Omit<Base, "_id"> {
  @Expose()
  id!: Base["id"]

  @Exclude()
  __v!: number

  @Exclude()
  createdAt!: TimeStamps["createdAt"]

  @Exclude()
  updatedAt!: TimeStamps["updatedAt"]
}

@Exclude()
export class AccountSchema extends BaseSchema implements AdapterAccount {
  @prop({ required: true })
  @Expose()
  userId!: AdapterAccount["userId"]

  @prop({ required: true })
  @Expose()
  providerAccountId!: AdapterAccount["providerAccountId"]

  @prop({ required: true })
  @Expose()
  provider!: AdapterAccount["provider"]

  @prop({ required: true })
  @Expose()
  type!: AdapterAccount["type"]

  @prop({ required: false, default: undefined })
  @Expose()
  access_token?: AdapterAccount["access_token"]

  @prop({ required: false, default: undefined })
  @Expose()
  token_type?: AdapterAccount["token_type"]

  @prop({ required: false, default: undefined })
  @Expose()
  id_token?: AdapterAccount["id_token"]

  @prop({ required: false, default: undefined })
  @Expose()
  refresh_token?: AdapterAccount["refresh_token"]

  @prop({ required: false, default: undefined })
  @Expose()
  scope?: AdapterAccount["scope"]

  @prop({ required: false, default: undefined })
  @Expose()
  expires_at?: AdapterAccount["expires_at"]

  @prop({ required: false, default: undefined })
  @Expose()
  session_state?: AdapterAccount["session_state"];

  [parameter: string]: any
}

@Exclude()
export class SessionSchema extends BaseSchema implements AdapterSession {
  @prop({ required: true })
  @Expose()
  userId!: AdapterSession["userId"]

  @prop({ required: true })
  @Expose()
  sessionToken!: AdapterSession["sessionToken"]

  @prop({ required: true })
  @Expose()
  expires!: AdapterSession["expires"]
}

@Exclude()
export class UserSchema extends BaseSchema implements AdapterUser {
  @prop({ required: false, default: null })
  @Expose()
  name?: AdapterUser["name"]

  @prop({ required: true, unique: true })
  @Expose()
  email!: AdapterUser["email"]

  @prop({ required: false, default: null })
  @Expose()
  image?: AdapterUser["image"]

  @prop({ required: false, default: null })
  @Expose()
  emailVerified!: AdapterUser["emailVerified"]

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
  id!: Base["id"]

  @prop({ required: true })
  @Expose()
  identifier!: VerificationToken["identifier"]

  @prop({ required: true })
  @Expose()
  @Type(() => Date)
  expires!: VerificationToken["expires"]

  @prop({ required: true })
  @Expose()
  token!: VerificationToken["token"]
}
