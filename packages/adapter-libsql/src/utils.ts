import { Client, InStatement, InValue, ResultSet, Row } from "@libsql/client/."

function assertPresent<T>(value: T | undefined): T {
  if (value !== undefined) {
    return value
  }

  throw new Error(`Expected value='${value}' to be present!`)
}

function mapRow<T>(row: Row): T {
  const temp: any = {}

  for (const [key, value] of Object.entries(row)) {
    if (isDateFieldName(key)) {
      temp[key] = parseDate(value)
    } else {
      temp[key] = value
    }
  }

  return temp as T
}

const DATE_FIELD_NAMES = ["emailVerified", "expires"]

function isDateFieldName(value: string) {
  return DATE_FIELD_NAMES.includes(value)
}

/**
 * @returns `Date` or throw exception if parsing is not possible
 */
function parseDate(v: any): Date {
  if (typeof v === "number" || typeof v === "string") {
    const date = new Date(v)
    const isValidDate = !isNaN(date.valueOf())

    if (isValidDate) {
      return date
    }
  }

  throw new Error(`Can't parse '${v}' as Date!`)
}

function undefinedToNull<T>(v: T | undefined | null): T | null {
  if (v === undefined) {
    return null
  }
  return v
}

export function sqlTemplate(
  strings: TemplateStringsArray,
  ...args: Array<InValue | undefined>
): InStatement {
  let sql = strings[0] ?? ""
  for (let i = 1; i < strings.length; i++) {
    sql += "?" + (strings[i] ?? "")
  }

  return {
    sql,
    args: args.map(undefinedToNull),
  }
}

/**
 * @internal
 */
export class LibSQLWrapper {
  constructor(private readonly client: Client) {}

  // overload signatures
  create<T>(opts: {
    insertStatement: InStatement
    selectStatemetn: InStatement
  }): Promise<T>
  create<T>(opts: { insertStatement: InStatement }): Promise<void>

  // sqlite client doesn't return rows when new one is created,
  // that's why if we want to get created row we have to run select query
  async create<T>({
    insertStatement,
    selectStatemetn,
  }: {
    insertStatement: InStatement
    selectStatemetn?: InStatement
  }): Promise<T | void> {
    if (selectStatemetn) {
      const rs = await this.client.batch(
        [insertStatement, selectStatemetn],
        "write"
      )

      const selectRs: ResultSet | undefined = rs[1]
      const row = assertPresent(selectRs?.rows[0])
      return mapRow<T>(row)
    } else {
      await this.client.execute(insertStatement)
    }
  }

  async first<T>(
    strings: TemplateStringsArray,
    ...args: Array<InValue | undefined>
  ): Promise<T | null> {
    const statement = sqlTemplate(strings, ...args)
    const rs = await this.client.execute(statement)
    const row: Row | undefined = rs.rows[0]

    if (row === undefined) {
      return null
    }

    return mapRow<T>(row)
  }

  async run(
    strings: TemplateStringsArray,
    ...args: Array<InValue | undefined>
  ): Promise<void> {
    const statement = sqlTemplate(strings, ...args)
    await this.client.execute(statement)
  }
}
