// Inspired by https://github.com/tonivj5/typeorm-naming-strategies
import { DefaultNamingStrategy } from 'typeorm'
import { snakeCase, camelCase } from 'typeorm/util/StringUtils'

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy {
  // Pluralise table names (set customName to override)
  tableName (className: string, customName: string) {
    return customName || snakeCase(`${className}s`)
  }

  columnName (propertyName: string, customName: string, embeddedPrefixes: string[]) {
    return `${snakeCase(embeddedPrefixes.join('_'))}${customName || snakeCase(propertyName)}`
  }

  relationName (propertyName: string) {
    return snakeCase(propertyName)
  }

  joinColumnName (relationName: string, referencedColumnName: string) {
    return snakeCase(`${relationName}_${referencedColumnName}`)
  }

  // TODO: why is `_secondPropertyName` accepted in the first place?
  joinTableName (firstTableName: string, secondTableName: string, firstPropertyName: string, _secondPropertyName: string) {
    return snakeCase(`${firstTableName}_${firstPropertyName.replace(/\./gi, '_')}_${secondTableName}`)
  }

  joinTableColumnName (tableName: string, propertyName: string, columnName: string) {
    return snakeCase(`${tableName}_${(columnName || propertyName)}`)
  }

  classTableInheritanceParentColumnName (parentTableName: string, parentTableIdPropertyName: string) {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`)
  }

  eagerJoinRelationAlias (alias: string, propertyPath: string) {
    return `${alias}__${propertyPath.replace('.', '_')}`
  }
}

export class CamelCaseNamingStrategy extends DefaultNamingStrategy {
  // Pluralise collection names, uses (set customName to override)
  tableName (className: string, customName: string) {
    return customName || camelCase(`${className}s`)
  }
}
