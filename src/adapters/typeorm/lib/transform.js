// Perform transforms on SQL models so they can be used with other databases
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const mongodb = (models, options) => {
  // Important!
  //
  // 1. You must set 'objectId: true' on one property on a model in MongoDB.
  //
  //   'objectId' MUST be set on the primary ID field. This overrides other
  //   values on that object in TypeORM (e.g. type: 'int' or 'primary').
  //
  // 2. Other properties that are Object IDs in the same model MUST be set to
  //    type: 'objectId' (and should not be set to `objectId: true`).
  //
  //    If you set 'objectId: true' on multiple properties on a model you will
  //    see the result of queries like find() is wrong. You will see the same
  //    Object ID in every property of type Object ID in the result (but the
  //    database will look fine); so use `type: 'objectId'` for them instead.

  // If models are custom models (which we can check to see if they were
  // passed as an option; if not it's a default model) then we *don't* transform
  // them and simply use them as is - this ensures transforms are only performed
  // on the default models.
  const { models: customModels = {} } = options

  if (!customModels.User) {
    delete models.User.schema.columns.id.type
    models.User.schema.columns.id.objectId = true

    // The options `unique: true` and `nullable: true` don't work the same
    // with MongoDB as they do with SQL databases like MySQL and Postgres,
    // we also to add sparce to the index. This still doesn't allow multiple
    // *null* values, but does allow some records to omit the property.
    delete models.User.schema.columns.email.unique
    models.User.schema.indices = [
      {
        name: 'email',
        unique: true,
        sparse: true,
        columns: ['email']
      }
    ]
  }

  if (!customModels.Account) {
    delete models.Account.schema.columns.id.type
    models.Account.schema.columns.id.objectId = true
    models.Account.schema.columns.userId.type = 'objectId'
  }

  if (!customModels.Session) {
    delete models.Session.schema.columns.id.type
    models.Session.schema.columns.id.objectId = true
    models.Session.schema.columns.userId.type = 'objectId'
  }

  if (!customModels.VerificationRequest) {
    delete models.VerificationRequest.schema.columns.id.type
    models.VerificationRequest.schema.columns.id.objectId = true
    models.VerificationRequest.schema.tableName = 'verificationRequests'
  }
}

const sqlite = (models, options) => {
  // Apply snake case naming strategy by default for SQLite databases
  if (!options.namingStrategy) {
    options.namingStrategy = new SnakeNamingStrategy()
  }

  const { models: customModels = {} } = options

  // SQLite does not support `timestamp` fields so we remap them to `datetime`
  // `timestamp` is an ANSI SQL specification and widely supported by other
  // databases, so this schema change is specific to SQLite. SQLite adds
  // 'create' and 'update' fields to allow rows, but that behaviour is specific
  // to SQLite and so they are not used by this databases.
  if (!customModels.User) {
    models.User.schema.columns.emailVerified.type = 'datetime'
    models.User.schema.columns.created.type = 'datetime'
    models.User.schema.columns.updated.type = 'datetime'
  }

  if (!customModels.Account) {
    models.Account.schema.columns.accessTokenExpires.type = 'datetime'
    models.Account.schema.columns.created.type = 'datetime'
    models.Account.schema.columns.updated.type = 'datetime'
  }

  if (!customModels.Session) {
    models.Session.schema.columns.expires.type = 'datetime'
    models.Session.schema.columns.created.type = 'datetime'
    models.Session.schema.columns.updated.type = 'datetime'
  }

  if (!customModels.VerificationRequest) {
    models.VerificationRequest.schema.columns.expires.type = 'datetime'
    models.VerificationRequest.schema.columns.created.type = 'datetime'
    models.VerificationRequest.schema.columns.updated.type = 'datetime'
  }
}

export default (config, models, options) => {
  if ((config.type && config.type.startsWith('mongodb')) ||
      (config.url && config.url.startsWith('mongodb'))) {
    mongodb(models, options)
  } else if ((config.type && config.type.startsWith('sqlite')) ||
             (config.url && config.url.startsWith('sqlite'))) {
    sqlite(models, options)
  } else {
    // Apply snake case naming strategy by default for SQL databases
    if (!options.namingStrategy) {
      options.namingStrategy = new SnakeNamingStrategy()
    }
  }
}
