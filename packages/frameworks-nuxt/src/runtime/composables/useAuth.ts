import type { Session, User } from "@auth/core/types"
import { signIn, signOut } from "../lib/client"

export function useAuth() {
  const status = useState(
    "auth:session:status",
    () => "unauthenticated"
  ) as Ref<"loading" | "authenticated" | "unauthenticated" | "error">

  const session = useState("auth:session", () => null) as Ref<Session | null>

  const user = computed(
    () => session.value?.user ?? null
  ) as ComputedRef<User | null>

  watch(session, (newSession: Session | null) => {
    if (newSession === null) return (status.value = "unauthenticated")
    if (Object.keys(newSession).length) return (status.value = "authenticated")
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
    status: status,
    user,

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
