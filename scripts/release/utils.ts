import type { PackageJson } from "type-fest"

import fs from "fs/promises"
import path from "path"

async function read(file: string): Promise<PackageJson> {
  const content = await fs.readFile(path.join(process.cwd(), file), "utf8")
  return JSON.parse(content)
}

async function update(file: string, data: Partial<PackageJson>): Promise<void> {
  const original = await pkgJson.read(file)
  const content = JSON.stringify({ ...original, ...data }, null, 2)
  await fs.writeFile(path.join(process.cwd(), file), content, "utf8")
}

export const pkgJson = { read, update }
