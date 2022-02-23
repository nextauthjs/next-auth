import { hooks } from "$lib/hooks"
import { authOptions } from "./routes/api/auth/[...nextauth]"

export const { handle, getSession } = hooks(authOptions)
