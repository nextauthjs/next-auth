// Inspired by https://github.com/tonivj5/typeorm-naming-strategies
import { DefaultNamingStrategy } from 'typeorm'
import { snakeCase, camelCase } from 'typeorm/util/StringUtils'

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy {
  // Pluralise table names (set customName to override)
  tableName (className, customName) {
    return customName || snakeCase(`${className}s`)
  }

  columnName (propertyName, customName, embeddedPrefixes) {
    return `${snakeCase(embeddedPrefixes.join('_'))}${customName || snakeCase(propertyName)}`
  }

  relationName (propertyName) {
    return snakeCase(propertyName)
  }

  joinColumnName (relationName, referencedColumnName) {
    return snakeCase(`${relationName}_${referencedColumnName}`)
  }

  joinTableName (firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
    return snakeCase(`${firstTableName}_${firstPropertyName.replace(/\./gi, '_')}_${secondTableName}`)
  }

  joinTableColumnName (tableName, propertyName, columnName) {
    return snakeCase(`${tableName}_${(columnName || propertyName)}`)
  }

  classTableInheritanceParentColumnName (parentTableName, parentTableIdPropertyName) {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`)
  }

  eagerJoinRelationAlias (alias, propertyPath) {
    return `${alias}__${propertyPath.replace('.', '_')}`
  }
}

export class CamelCaseNamingStrategy extends DefaultNamingStrategy {
  // Pluralise collection names, uses (set customName to override)
  tableName (className, customName) {
    return customName || camelCase(`${className}s`)
  }
}
