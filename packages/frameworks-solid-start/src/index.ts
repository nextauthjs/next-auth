import {
  AuthHandler,
  type AuthAction,
  type AuthOptions,
  type Session,
} from "@auth/core";
import { Cookie, parseString, splitCookiesString } from "set-cookie-parser";
import { serialize } from "cookie";

export interface SoliduthOptions extends AuthOptions {
  /**
   * Defines the base path for the auth routes.
   * @default '/api/auth'
   */
  prefix?: string;
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
];

export type SolidAuthConfig = AuthOptions & {
    // might be fixed in the pr?
//   failureRedirect?: string; 
};

// currently multiple cookies are not supported, so we keep the next-auth.pkce.code_verifier cookie for now:
// because it gets updated anyways
// src: https://github.com/solidjs/solid-start/issues/293
const getSetCookieCallback = (cook?: string | null): Cookie | undefined => {
  if (!cook) return;
  const splitCookie = splitCookiesString(cook);
  for (const cookName of [
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
    "next-auth.pkce.code_verifier",
    "__Secure-next-auth.pkce.code_verifier",
  ]) {
    const temp = splitCookie.find((e) => e.startsWith(`${cookName}=`));
    if (temp) {
      return parseString(temp);
    }
  }
  return parseString(splitCookie?.[0] ?? ""); // just return the first cookie if no session token is found
};

function SolidAuthHandler(prefix: string, authOptions: SolidAuthConfig) {
  return async (event: APIEvent) => {
    const { request } = event;
    const url = new URL(request.url);
    const [action] = url.pathname.slice(prefix.length + 1).split("/");
    if (
      actions.includes(action as AuthAction) &&
      url.pathname.startsWith(prefix + "/")
    ) {
      const res = await AuthHandler(request, authOptions);
      if (["callback", "signin", "signout"].includes(action)) {
        const parsedCookie = getSetCookieCallback(
          res.clone().headers.get("Set-Cookie")
        );
        if (parsedCookie) {
          res.headers.set(
            "Set-Cookie",
            serialize(
              parsedCookie.name,
              parsedCookie.value,
              parsedCookie as any
            )
          );
        }
      }
      return res;
    }
  };
}

export function SolidAuth(options: SoliduthOptions) {
  const { prefix = "/api/auth", ...authOptions } = options;
  authOptions.secret ??= process.env.AUTH_SECRET;
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  );
  const handler = SolidAuthHandler(prefix, authOptions);
  return {
    async GET(event: APIEvent) {
      return await handler(event);
    },
    async POST(event: APIEvent) {
      return await handler(event);
    },
  };
}

export type GetSessionResult = Promise<Session | null>;

export async function getSession(
  req: Request,
  options: AuthOptions
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET;
  options.trustHost ??= true;

  const url = new URL("/api/auth/session", req.url);
  const response = await AuthHandler(
    new Request(url, { headers: req.headers }),
    options
  );

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}

type APIEvent = any;

