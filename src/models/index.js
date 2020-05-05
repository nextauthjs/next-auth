import { Account, AccountSchema } from './account'
import { User, UserSchema } from './user'

export default {
  Account: {
    model: Account,
    schema: AccountSchema
  },
  User: {
    model: User,
    schema: UserSchema
  }
}