import type { Session, User } from "@auth/core/types"
import { signIn, signOut } from "../lib/client"

export type AuthState =
  | { loggedIn: true; user: User }
  | { loggedIn: false; user: null }

export function useAuth() {
  const auth = useState<AuthState>("auth", () => {
    return {
      loggedIn: false,
      user: null,
    } as AuthState
  })

  const session = useState("auth:session", () => null) as Ref<Session | null>

  watch(session, (newSession: Session | null) => {
    if (newSession === null)
      return (auth.value = { loggedIn: false, user: null })
    if (Object.keys(newSession).length)
      return (auth.value = { loggedIn: true, user: newSession.user! })
  })

  const updateSession = (u: Session | null | (() => Session)) => {
    session.value = typeof u === "function" ? u() : u
  }

  const removeSession = () => {
    // cookies.value = null
    updateSession(null)
  }

  return {
    session: readonly(session) as Readonly<Ref<Session | null>>,
    auth: auth as Ref<AuthState>,

    updateSession,

    removeSession,
    /**
     * Client-side method to initiate a signin flow
     * or send the user to the signin page listing all possible providers.
     * Automatically adds the CSRF token to the request.
     *
     * ```ts
     * const { signIn } =  useAuth()
     * signIn()
     * signIn("provider") // example: signIn("github")
     * ```
     */
    signIn,

    /**
     * Signs the user out, by removing the session cookie.
     * Automatically adds the CSRF token to the request.
     *
     * ```ts
     * const { signOut } = useAuth()
     * signOut()
     * ```
     */
    signOut,
  }
}
