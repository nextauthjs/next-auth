import { AuthHandler, type AuthAction, type AuthOptions } from "@auth/core";
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
  "_log",
];

export type ISolidAuthHandlerOpts = AuthOptions & {
  failureRedirect?: string;
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

function SolidAuthHandler(prefix: string, authOptions: ISolidAuthHandlerOpts) {
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
    const h = authOptions.failureRedirect ?? "/";
    const error = url.searchParams.get("error");
    const error_description = url.searchParams.get("error_description");
    const error_uri = url.searchParams.get("error_uri");
    throw redirect(
      `${h}?error=${error}&error_description=${error_description}&error_uri=${error_uri}`,
      {
        status: 302,
      }
    );
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
  return SolidAuthHandler(prefix, authOptions);
}

// unknown file extension error will be thrown when using "solid-start", so we copy what we actually need

type APIEvent = any;

const LocationHeader = "Location";
function redirect(url: string, init: number | ResponseInit = 302): Response {
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }

  if (url === "") {
    url = "/";
  }

  if (process.env.NODE_ENV === "development") {
    if (url.startsWith(".")) {
      throw new Error("Relative URLs are not allowed in redirect");
    }
  }

  let headers = new Headers(responseInit.headers);
  headers.set(LocationHeader, url);

  const response = new Response(null, {
    ...responseInit,
    headers: headers,
  });

  return response;
}
