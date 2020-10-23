"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CamelCaseNamingStrategy = exports.SnakeCaseNamingStrategy = void 0;

var _typeorm = require("typeorm");

var _StringUtils = require("typeorm/util/StringUtils");

class SnakeCaseNamingStrategy extends _typeorm.DefaultNamingStrategy {
  tableName(className, customName) {
    return customName || (0, _StringUtils.snakeCase)("".concat(className, "s"));
  }

  columnName(propertyName, customName, embeddedPrefixes) {
    return "".concat((0, _StringUtils.snakeCase)(embeddedPrefixes.join('_'))).concat(customName || (0, _StringUtils.snakeCase)(propertyName));
  }

  relationName(propertyName) {
    return (0, _StringUtils.snakeCase)(propertyName);
  }

  joinColumnName(relationName, referencedColumnName) {
    return (0, _StringUtils.snakeCase)("".concat(relationName, "_").concat(referencedColumnName));
  }

  joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
    return (0, _StringUtils.snakeCase)("".concat(firstTableName, "_").concat(firstPropertyName.replace(/\./gi, '_'), "_").concat(secondTableName));
  }

  joinTableColumnName(tableName, propertyName, columnName) {
    return (0, _StringUtils.snakeCase)("".concat(tableName, "_").concat(columnName || propertyName));
  }

  classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
    return (0, _StringUtils.snakeCase)("".concat(parentTableName, "_").concat(parentTableIdPropertyName));
  }

  eagerJoinRelationAlias(alias, propertyPath) {
    return "".concat(alias, "__").concat(propertyPath.replace('.', '_'));
  }

}

exports.SnakeCaseNamingStrategy = SnakeCaseNamingStrategy;

class CamelCaseNamingStrategy extends _typeorm.DefaultNamingStrategy {
  tableName(className, customName) {
    return customName || (0, _StringUtils.camelCase)("".concat(className, "s"));
  }

}

exports.CamelCaseNamingStrategy = CamelCaseNamingStrategy;