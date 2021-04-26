import TypeORM from './typeorm'
import Prisma from './prisma'

export default {
  Default: TypeORM.Adapter,
  TypeORM,
  Prisma
}
