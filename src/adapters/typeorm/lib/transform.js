// Perform transforms on SQL models so they can be used with other databases
import { SnakeCaseNamingStrategy, CamelCaseNamingStrategy } from './naming-strategies'

const postgresTransform = (models, options) => {
  // Apply snake case naming strategy for Postgres databases
  if (!options.namingStrategy) {
    options.namingStrategy = new SnakeCaseNamingStrategy()
  }

  // For Postgres we need to use the `timestamp with time zone` type
  // aka `timestamptz` to store timestamps correctly in UTC.
  for (const model in models) {
    for (const column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        models[model].schema.columns[column].type = 'timestamptz'
      }
    }
  }
}

const mysqlTransform = (models, options) => {
  // Apply snake case naming strategy for MySQL databases
  if (!options.namingStrategy) {
    options.namingStrategy = new SnakeCaseNamingStrategy()
  }

  // For MySQL we default milisecond precision of all timestamps to 6 digits.
  // This ensures all timestamp fields use the same precision (unless explictly
  // configured otherwise) and that values in MySQL match those Postgress.
  for (const model in models) {
    for (const column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        // If precision explictly set (including to null) don't change it
        if (typeof models[model].schema.columns[column].precision === 'undefined') {
          models[model].schema.columns[column].precision = 6
        }
      }
    }
  }
}

const mongodbTransform = (models, options) => {
  // A CamelCase naming strategy is used for all document databases
  if (!options.namingStrategy) {
    options.namingStrategy = new CamelCaseNamingStrategy()
  }

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
  for (const model in models) {
    delete models[model].schema.columns.id.type
    models[model].schema.columns.id.objectId = true
  }

  // Ensure reference to User ID in other models are Object IDs
  // This needs to done for any properties that reference another entity by ID
  models.Account.schema.columns.userId.type = 'objectId'
  models.Session.schema.columns.userId.type = 'objectId'

  // The options `unique: true` and `nullable: true` don't work the same
  // with MongoDB as they do with SQL databases like MySQL and Postgres,
  // we need to create a sparse index to only allow unique values, while
  // still allowing multiple entires to omit the email address.
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

const sqliteTransform = (models, options) => {
  // Apply snake case naming strategy for SQLite databases
  if (!options.namingStrategy) {
    options.namingStrategy = new SnakeCaseNamingStrategy()
  }

  // SQLite does not support `timestamp` fields so we remap them to `datetime`
  // in all models.
  //
  // `timestamp` is an ANSI SQL specification and widely supported by other
  // databases so this transform is a specific workaround required for SQLite.
  //
  // NB: SQLite adds 'create' and 'update' fields to allow rows, but that is
  // specific to SQLite and so we ignore that behaviour.
  for (const model in models) {
    for (const column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        models[model].schema.columns[column].type = 'datetime'
      }
    }
  }
}

const mssqlTransform = (models, options) => {
  // Apply snake case naming strategy,
  if (!options.namingStrategy) {
    // SQL server users, tend to use TitleCase, 
    // but this a 'js' library, it shouldn't :) ?
    options.namingStrategy = new CamelCaseNamingStrategy()
  }
  // SQL Server deprecated TIMESTAMP in favor of ROWVERSION.
  // But ROWVERSION is not what it was intended in the other adapters.
  for (const model in models) {
    for (const column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        models[model].schema.columns[column].type = 'datetime'
      }
    }
  }
}

export default (config, models, options) => {
  // @TODO Refactor into switch statement
  if ((config.type && config.type.startsWith('mongodb')) ||
      (config.url && config.url.startsWith('mongodb'))) {
    mongodbTransform(models, options)
  } else if ((config.type && config.type.startsWith('postgres')) ||
             (config.url && config.url.startsWith('postgres'))) {
    postgresTransform(models, options)
  } else if ((config.type && config.type.startsWith('mysql')) ||
            (config.url && config.url.startsWith('mysql'))) {
    mysqlTransform(models, options)
  } else if ((config.type && config.type.startsWith('sqlite')) ||
             (config.url && config.url.startsWith('sqlite'))) {
    sqliteTransform(models, options)  
  } else if ((config.type && config.type.startsWith('mssql')) ||
             (config.url && config.url.startsWith('mssql'))) {   
    mssqlTransform(models, options)
  } else {
    // For all other SQL databases (e.g. MySQL) apply snake case naming
    // strategy, but otherwise use the models and schemas as they are.
    if (!options.namingStrategy) {
      options.namingStrategy = new SnakeCaseNamingStrategy()
    }
  }
}
