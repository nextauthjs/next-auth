import * as TypeORM from "./typeorm"
import * as Prisma from "./prisma"

export { TypeORM, Prisma }

export default {
  Default: TypeORM.Adapter,
  TypeORM,
  Prisma,
}
