import { Exclude, Expose, Transform } from "class-transformer"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { Severity, modelOptions } from "@typegoose/typegoose"

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
