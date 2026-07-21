/* eslint-disable @typescript-eslint/no-throw-literal */
import type {
  DataFunctionArgs,
  AppLoadContext,
} from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import type { Provider, RedirectableProviderType } from "@auth/core/providers";
import { Auth } from "@auth/core";
import { parse } from "cookie";
import {
  getBody,
  getValue,
  getAuthjsCookieNames,
} from "remix-auth/src/utils/utils";
import type { ProviderID, RemixAuthConfig } from "remix-auth/src/types";

type AuthAction =
  | "providers"
  | "session"
  | "csrf"
  | "signin"
  | "signout"
  | "callback"
  | "verify-request"
  | "error";

const actions = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
] as const;
export class RemixAuthenticator<User> {
  private readonly options: RemixAuthConfig;

  constructor(
    options: RemixAuthConfig,
    env: Record<string, string | undefined> | AppLoadContext
  ) {
    this.options = options;
    this.options.secret ??= env.AUTH_SECRET as string | undefined;
    this.options.trustHost ??= !!(
      env.AUTH_TRUST_HOST ?? env.NODE_ENV === "development"
    );
  }

  async handleAuthRoute<
    P extends RedirectableProviderType | undefined = undefined
  >({
    request,
    action,
    providerId,
    params,
  }: {
    request: Request;
    action: string;
    providerId?: ProviderID<P> | undefined;
    params?: DataFunctionArgs["params"];
  }) {
    const url = new URL(request.url);
    const formData = (await getBody(request.clone())) ?? {};
    Object.entries(formData).forEach(([key, val]) => {
      if (typeof val === "string") {
        url.searchParams.set(key, val);
      }
    });

    const method = request.method.toUpperCase();
    const cookies = parse(request.headers.get("Cookie") ?? "") ?? {};

    const authjsCookies = getAuthjsCookieNames(this.options, request);
    action =
      action || (getValue("action", url.searchParams, params) as AuthAction);
    providerId = providerId ?? getValue("providerId", url.searchParams, params);

    let csrfToken =
      cookies[authjsCookies.csrfToken.name] ||
      getValue("csrfToken", url.searchParams, params);

    const blockHtmlReturn = getValue(
      "blockHtmlReturn",
      url.searchParams,
      params
    );

    const callbackUrl =
      getValue("callbackUrl", url.searchParams, params) ??
      cookies[authjsCookies.callbackUrl.name] ??
      request.headers.get("Referer") ??
      url.href.replace(`/${action}`, "").replace(`/${providerId ?? ""}`, "");

    const status = {
      status: 400,
      body: "Bad Request",
    };

    const isPost = method === "POST";
    if (!providerId && isPost && action !== "signout") {
      // IF POST, PROVIDER IS REQUIRED
      status.body = 'Missing "provider" parameter';
    } else if (!action || !actions.includes(action as AuthAction)) {
      // ACTION IS REQUIRED
      status.body = 'Invalid/Missing "action" parameter';
    } else {
      // get the callbackUrl and csrfToken into the request if needed
      url.searchParams.set("callbackUrl", callbackUrl);
      if (csrfToken) {
        [csrfToken] = csrfToken.split("|");
        url.searchParams.set("csrfToken", csrfToken);
      }
      if (blockHtmlReturn) {
        url.searchParams.set("blockHtmlReturn", blockHtmlReturn);
      }
      const authRequest = isPost
        ? new Request(request.url, {
            ...request,
            headers: request.headers,
            method: "POST",
            body: url.searchParams,
          })
        : new Request(url.href, request);

      const authResponse = await Auth(authRequest, this.options);
      const location = authResponse.headers.get("Location");

      if (
        (location &&
          blockHtmlReturn &&
          authResponse.status >= 300 &&
          authResponse.status < 400 &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          location.includes("verify-request")) ||
        (blockHtmlReturn &&
          authResponse.headers.get("Content-Type") === "text/html")
      ) {
        return json({
          action,
          providerId,
          callbackUrl,
          location,
        });
      }
      return authResponse;
    }

    throw new Response(status.body, {
      status: status.status,
      statusText: status.body,
    });
  }

  async getSession(req: Request): Promise<{ user?: User } | null> {
    const url = new URL("/api/auth/session", req.url);
    const request = new Request(url, { headers: req.headers });
    const response = await Auth(request, this.options);
    const { status = 200 } = response;
    const data: Record<string, any> = await response.json();

    if (!data || !Object.keys(data).length) return null;
    if (status === 200) return data;
    throw new Error(data?.message || data?.error || "Unknown error");
  }

  async getCSRFToken(req: Request): Promise<string | null> {
    const url = new URL("/api/auth/csrf", req.url);
    const request = new Request(url, { headers: req.headers });
    const response = await Auth(request, this.options);
    const { status = 200 } = response;
    const data: Record<string, any> = await response.json();

    if (!data || !Object.keys(data).length) return null;
    if (status === 200 && data?.csrfToken) return data.csrfToken;
    throw new Error(data?.message || data?.error || "Unknown error");
  }

  /**
   * Call this to check if the user is authenticated. It will return a Promise
   * with the user object or null, you can use this to check if the user is
   * logged-in or not without triggering the whole authentication flow.
   * @example
   * async function loader({ request }: LoaderArgs) {
   *   // if the user is not authenticated, redirect to login
   *   let user = await authenticator.isAuthenticated(request, {
   *     failureRedirect: "/login",
   *   });
   *   // do something with the user
   *   return json(privateData);
   * }
   * @example
   * async function loader({ request }: LoaderArgs) {
   *   // if the user is authenticated, redirect to /dashboard
   *   await authenticator.isAuthenticated(request, {
   *     successRedirect: "/dashboard"
   *   });
   *   return json(publicData);
   * }
   * @example
   * async function loader({ request }: LoaderArgs) {
   *   // manually handle what happens if the user is or not authenticated
   *   let user = await authenticator.isAuthenticated(request);
   *   if (!user) return json(publicData);
   *   return sessionLoader(request);
   * }
   */
  async isAuthenticated(
    request: Request,
    options?: { successRedirect?: never; failureRedirect?: never }
  ): Promise<User | null>;
  async isAuthenticated(
    request: Request,
    options: { successRedirect: string; failureRedirect?: never }
  ): Promise<null>;
  async isAuthenticated(
    request: Request,
    options: { successRedirect?: never; failureRedirect: string }
  ): Promise<User>;
  async isAuthenticated(
    request: Request,
    options: { successRedirect: string; failureRedirect: string }
  ): Promise<null>;
  async isAuthenticated(
    request: Request,
    options:
      | { successRedirect?: never; failureRedirect?: never }
      | { successRedirect: string; failureRedirect?: never }
      | { successRedirect?: never; failureRedirect: string }
      | { successRedirect: string; failureRedirect: string } = {}
  ): Promise<User | null> {
    const session = await this.getSession(request);

    if (session?.user) {
      if (options.successRedirect) throw redirect(options.successRedirect);
      else return session.user;
    }

    if (options.failureRedirect) throw redirect(options.failureRedirect);
    else return null;
  }

  async getProviders(req: Request): Promise<Record<string, Provider>> {
    const url = new URL("/api/auth/providers", req.url);
    const request = new Request(url, { headers: req.headers });
    const response = await Auth(request, this.options);
    const { status = 200 } = response;
    const data: Record<string, any> = await response.json();
    if (!data || !Object.keys(data)?.length) return {};
    if (status === 200) return data as Record<string, Provider>;
    throw new Error(data?.message || data?.error || "Unknown error");
  }

  getAuthJSCookieNames(request: Request) {
    return getAuthjsCookieNames(this.options, request);
  }

  getCallbackUrlFromCookie(request: Request): string {
    const authjsCookies = getAuthjsCookieNames(this.options, request);
    const cookies = parse(request.headers.get("Cookie") ?? "") ?? {};
    return cookies[authjsCookies.callbackUrl.name] || "";
  }

  getCSRFTokenFromCookie(request: Request): string {
    const authjsCookies = getAuthjsCookieNames(this.options, request);
    const cookies = parse(request.headers.get("Cookie") ?? "") ?? {};
    return cookies[authjsCookies.csrfToken.name] || "";
  }

  isValidAction(action: string | undefined): boolean {
    return action ? actions.includes(action as AuthAction) : false;
  }
}
