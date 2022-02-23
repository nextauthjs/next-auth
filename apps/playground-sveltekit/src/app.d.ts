/// <reference types="@sveltejs/kit" />
import type { Session as NextAuthSession } from "next-auth"
import type { JWT } from "next-auth/jwt"

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
  interface Locals {
    token: JWT
  }
  interface Platform {}

  interface Session extends NextAuthSession {}

  interface Stuff {}
}
