import TypeORM from './typeorm'
import Prisma from './prisma'
import PrismaNew from './prisma-new'

export default {
  Default: TypeORM.Adapter,
  TypeORM,
  Prisma,
  PrismaNew
}
