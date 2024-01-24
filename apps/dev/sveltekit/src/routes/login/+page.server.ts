import {signIn, signOut} from "../../auth"
import type { Actions } from './$types'
export const actions = { signIn, signOut } satisfies Actions