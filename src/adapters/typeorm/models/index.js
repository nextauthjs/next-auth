import { Account, AccountSchema } from './account'
import { User, UserSchema } from './user'
import { Session, SessionSchema } from './session'
import { VerificationRequest, VerificationRequestSchema } from './verification-request'

export default {
  Account: {
    model: Account,
    schema: AccountSchema
  },
  User: {
    model: User,
    schema: UserSchema
  },
  Session: {
    model: Session,
    schema: SessionSchema
  },
  VerificationRequest: {
    model: VerificationRequest,
    schema: VerificationRequestSchema
  }
}
