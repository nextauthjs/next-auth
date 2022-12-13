/// <reference types="@sveltejs/kit" />
/// <reference types="next-auth-sveltekit" />
import type {
  User as NextAuthUser,
  Session as NextAuthSession,
} from "next-auth"

// optionally extend the `user`
interface User extends NextAuthUser {
  // add custom fields here
}

interface AppSession extends NextAuthSession {
  user: User
}

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare global {
  declare namespace App {
    interface Locals {
      // session: AppSession
      getSession: () => Promise<AppSession>
    }

    interface Platform {}

    interface Session extends AppSession {}

    interface Stuff {}
  }
}
