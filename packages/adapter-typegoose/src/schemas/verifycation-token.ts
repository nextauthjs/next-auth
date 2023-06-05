import type { VerificationToken } from "next-auth/adapters"
import { Exclude, Expose, Type } from "class-transformer"
import { prop } from "@typegoose/typegoose"
import { BaseSchema } from "./base"

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
