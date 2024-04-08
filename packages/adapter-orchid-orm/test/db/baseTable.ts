import { createBaseTable } from "orchid-orm"
import { zodSchemaConfig } from "orchid-orm-schema-to-zod"

export const BaseTable = createBaseTable({
  schemaConfig: zodSchemaConfig,
  columnTypes: (t) => ({
    ...t,
    text: (min = 0, max = Infinity) => t.text(min, max),
  }),
})
