import { Exclude, Expose } from "class-transformer"
import { modelOptions, prop } from "@typegoose/typegoose"
import { BaseSchema } from "./base"
import type { AdapterAccount } from "next-auth/adapters"
import type { ProviderType } from "next-auth/providers"

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
