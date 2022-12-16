import { Session } from '@auth/core'

export default function useSession() {
  return useState<Session | null>('session', () => null)
}
