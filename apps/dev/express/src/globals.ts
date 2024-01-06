import path from "path"
import { fileURLToPath } from "url"

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

global.__filename = global.__filename ?? __filename
global.__dirname = global.__dirname ?? __dirname
