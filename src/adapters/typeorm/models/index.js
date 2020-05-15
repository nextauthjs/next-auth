import { Account, AccountSchema } from './account'
import { User, UserSchema } from './user'
import { Session, SessionSchema } from './session'
import { EmailVerification, EmailVerificationSchema } from './email-verification'

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
  EmailVerification: {
    model: EmailVerification,
    schema: EmailVerificationSchema
  }
}
