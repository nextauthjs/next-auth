import { Account, AccountSchema } from './account'
import { User, UserSchema } from './user'
import { Session, SessionSchema } from './session'
import { VerificationRequest, VerificationRequestSchema } from './verification-request'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

type ModelConfig<TModel, TSchema = any, T extends TModel = TModel> = {
  model: T;
  schema: EntitySchemaOptions<TSchema>;
};

export interface NextAuthModels {
  Account: ModelConfig<typeof Account>,
  User: ModelConfig<typeof User>,
  Session: ModelConfig<typeof Session>,
  VerificationRequest: ModelConfig<typeof VerificationRequest>
}


const models: NextAuthModels =  {
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
export default models;
