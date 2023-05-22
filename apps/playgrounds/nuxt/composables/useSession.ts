import { Session } from "@auth/core/types"

export default function useSession() {
  return useState<Session | null>("session", () => null)
}
