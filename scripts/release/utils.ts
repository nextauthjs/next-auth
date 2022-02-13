import type { PackageJson } from "type-fest"

import fs from "fs/promises"
import path from "path"

async function read(directory: string): Promise<PackageJson> {
  const content = await fs.readFile(
    path.join(process.cwd(), directory, "package.json"),
    "utf8"
  )
  return JSON.parse(content)
}

async function update(
  directory: string,
  data: Partial<PackageJson>
): Promise<void> {
  const original = await pkgJson.read(directory)
  const content = JSON.stringify({ ...original, ...data }, null, 2)
  await fs.writeFile(
    path.join(process.cwd(), directory, "package.json"),
    content,
    "utf8"
  )
}

export const pkgJson = { read, update }

export function debug(...args: any[]): void {
  if (!process.env.DEBUG) return
  const [first, ...rest] = args
  console.log(`\n[debug] ${first}\n`, ...rest, "\n")
}
