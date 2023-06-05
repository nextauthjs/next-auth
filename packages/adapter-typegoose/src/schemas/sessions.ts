import { prop } from "@typegoose/typegoose"
import type { AdapterSession } from "next-auth/adapters"
import { Exclude, Expose } from "class-transformer"
import { BaseSchema } from "./base"

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
