import { DefaultSession, QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";

declare module "@auth/qwik" {
  interface Session {
    user: {
      roles: string[];
    } & DefaultSession["user"];
  }
}

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [GitHub],
  }),
);
