import TypeORM from './typeorm'
import Prisma from './prisma'
import Fauna from './fauna'

export default {
  Default: TypeORM.Adapter,
  TypeORM,
  Prisma,
  Fauna
}
