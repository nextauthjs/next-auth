import { signOut } from "../../auth"
import type { Actions } from "./$types"

export const actions = { default: signOut } satisfies Actions
