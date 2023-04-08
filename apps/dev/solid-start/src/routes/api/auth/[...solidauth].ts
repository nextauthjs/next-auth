import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start";
import GitHub from "@auth/core/providers/github";
import { serverEnv } from "~/env/server";
import { type APIEvent } from "solid-start";

export const authOpts: SolidAuthConfig = {
  providers: [
    // @ts-expect-error https://github.com/nextauthjs/next-auth/issues/6174
    GitHub({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
