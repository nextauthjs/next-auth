import path from "path"
import { fileURLToPath } from "url"

globalThis.__filename ??= fileURLToPath(import.meta.url)
globalThis.__dirname ??= path.dirname(globalThis.__filename)
