"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _namingStrategies = require("./naming-strategies");

var postgresTransform = (models, options) => {
  if (!options.namingStrategy) {
    options.namingStrategy = new _namingStrategies.SnakeCaseNamingStrategy();
  }

  for (var model in models) {
    for (var column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        models[model].schema.columns[column].type = 'timestamptz';
      }
    }
  }
};

var mysqlTransform = (models, options) => {
  if (!options.namingStrategy) {
    options.namingStrategy = new _namingStrategies.SnakeCaseNamingStrategy();
  }

  for (var model in models) {
    for (var column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        if (typeof models[model].schema.columns[column].precision === 'undefined') {
          models[model].schema.columns[column].precision = 6;
        }
      }
    }
  }
};

var mongodbTransform = (models, options) => {
  if (!options.namingStrategy) {
    options.namingStrategy = new _namingStrategies.CamelCaseNamingStrategy();
  }

  for (var model in models) {
    delete models[model].schema.columns.id.type;
    models[model].schema.columns.id.objectId = true;
  }

  models.Account.schema.columns.userId.type = 'objectId';
  models.Session.schema.columns.userId.type = 'objectId';
  delete models.User.schema.columns.email.unique;

  if (!models.User.schema.indices) {
    models.User.schema.indices = [];
  }

  models.User.schema.indices.push({
    name: 'email',
    unique: true,
    sparse: true,
    columns: ['email']
  });
};

var sqliteTransform = (models, options) => {
  if (!options.namingStrategy) {
    options.namingStrategy = new _namingStrategies.SnakeCaseNamingStrategy();
  }

  for (var model in models) {
    for (var column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        models[model].schema.columns[column].type = 'datetime';
      }
    }
  }
};

var mssqlTransform = (models, options) => {
  if (!options.namingStrategy) {
    options.namingStrategy = new _namingStrategies.SnakeCaseNamingStrategy();
  }

  for (var model in models) {
    for (var column in models[model].schema.columns) {
      if (models[model].schema.columns[column].type === 'timestamp') {
        models[model].schema.columns[column].type = 'datetime';
      }
    }
  }

  delete models.User.schema.columns.email.unique;

  if (!models.User.schema.indices) {
    models.User.schema.indices = [];
  }

  models.User.schema.indices.push({
    name: 'email',
    columns: ['email'],
    unique: true,
    where: 'email IS NOT NULL'
  });
};

var _default = (config, models, options) => {
  if (config.type && config.type.startsWith('mongodb') || config.url && config.url.startsWith('mongodb')) {
    mongodbTransform(models, options);
  } else if (config.type && config.type.startsWith('postgres') || config.url && config.url.startsWith('postgres')) {
    postgresTransform(models, options);
  } else if (config.type && config.type.startsWith('mysql') || config.url && config.url.startsWith('mysql')) {
    mysqlTransform(models, options);
  } else if (config.type && config.type.startsWith('sqlite') || config.url && config.url.startsWith('sqlite')) {
    sqliteTransform(models, options);
  } else if (config.type && config.type.startsWith('mssql') || config.url && config.url.startsWith('mssql')) {
    mssqlTransform(models, options);
  } else {
    if (!options.namingStrategy) {
      options.namingStrategy = new _namingStrategies.SnakeCaseNamingStrategy();
    }
  }
};

exports.default = _default;