"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parseConnectionString = configString => {
  if (typeof configString !== 'string') {
    return configString;
  }

  try {
    var parsedUrl = new URL(configString);
    var config = {};

    if (parsedUrl.protocol.startsWith('mongodb+srv')) {
      config.type = 'mongodb';
      config.url = configString.replace(/\?(.*)$/, '');
      config.useNewUrlParser = true;
    } else {
      config.type = parsedUrl.protocol.replace(/:$/, '');
      config.host = parsedUrl.hostname;
      config.port = Number(parsedUrl.port);
      config.username = parsedUrl.username;
      config.password = parsedUrl.password;
      config.database = parsedUrl.pathname.replace(/^\//, '').replace(/\?(.*)$/, '');
      config.options = {};
    }

    if (config.type === 'mongodb') {
      config.useUnifiedTopology = true;
    }

    if (config.type === 'mssql') {
      config.options.enableArithAbort = true;
    }

    if (parsedUrl.search) {
      parsedUrl.search.replace(/^\?/, '').split('&').forEach(keyValuePair => {
        var [key, value] = keyValuePair.split('=');

        if (value === 'true') {
          value = true;
        }

        if (value === 'false') {
          value = false;
        }

        config[key] = value;
      });
    }

    return config;
  } catch (error) {
    return {
      url: configString
    };
  }
};

var loadConfig = (config, _ref) => {
  var {
    models,
    namingStrategy
  } = _ref;
  var defaultConfig = {
    name: 'nextauth',
    autoLoadEntities: true,
    entities: [new _typeorm.EntitySchema(models.User.schema), new _typeorm.EntitySchema(models.Account.schema), new _typeorm.EntitySchema(models.Session.schema), new _typeorm.EntitySchema(models.VerificationRequest.schema)],
    timezone: 'Z',
    logging: false,
    namingStrategy
  };
  return _objectSpread(_objectSpread({}, defaultConfig), config);
};

var _default = {
  parseConnectionString,
  loadConfig
};
exports.default = _default;