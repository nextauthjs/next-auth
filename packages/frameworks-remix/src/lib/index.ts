/* eslint-disable @typescript-eslint/no-throw-literal */
import type {
  DataFunctionArgs,
  AppLoadContext,
} from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import type { RedirectableProviderType, Provider } from "@auth/core/providers"
import { Auth } from "@auth/core"
import { parse } from "cookie"
import { getBody, getValue, authjsDefaultCookies } from "../utils"
import type { RemixAuthConfig, ProviderID } from "../types"
import { AuthAction } from "@auth/core/types"

const actions = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
] as const
export class RemixAuthenticator<User> {
  private readonly options: RemixAuthConfig

  constructor(
    options: RemixAuthConfig,
    env: Record<string, string | undefined> | AppLoadContext
  ) {
    this.options = options ?? {}
    this.options.secret ??= env.AUTH_SECRET as string | undefined
    this.options.trustHost ??= !!(
      env.AUTH_TRUST_HOST ?? env.NODE_ENV === "development"
    )
  }

  async handleAuthRoute<
    P extends RedirectableProviderType | undefined = undefined
  >({
    request,
    action,
    providerId,
    params,
  }: {
    request: Request
    action: string
    providerId?: ProviderID<P> | undefined
    params?: DataFunctionArgs["params"]
  }) {
    const url = new URL(request.url)
    const searchParams = url.searchParams || new URLSearchParams()
    const formData = (await getBody(request.clone())) ?? {}
    Object.entries(formData).forEach(([key, val]) => {
      if (typeof val === "string") {
        searchParams.set(key, val)
      }
    })

    const method = request.method.toUpperCase()
    const cookies = parse(request.headers.get("Cookie") ?? "") ?? {}

    const authjsCookies = {
      ...authjsDefaultCookies(
        this.options.useSecureCookies ?? url.protocol === "https:"
      ),
      // Allow user cookie options to override any cookie settings above
      ...this.options.cookies,
    }

    action = action || (getValue("action", searchParams, params) as AuthAction)
    providerId = providerId ?? getValue("providerId", searchParams, params)
    const csrfToken =
      cookies[authjsCookies.csrfToken.name] ||
      getValue("csrfToken", searchParams, params)

    console.log(
      'getValue("callbackUrl", searchParams, params)',
      getValue("callbackUrl", searchParams, params)
    )
    const callbackUrl =
      (getValue("callbackUrl", searchParams, params) ??
        cookies[authjsCookies.callbackUrl.name]) ||
      url.href

    console.log({
      url,
      method,
      action,
      providerId,
      callbackUrl,
      referrer: request.headers.get("Referer"),
      "X-Remix-Auth-Internal": request.headers.get("X-Remix-Auth-Internal"),
      "X-Auth-Return-Redirect": request.headers.get("X-Auth-Return-Redirect"),
    })
    const status = {
      status: 400,
      body: "Bad Request",
    }

    const isPost = method === "POST"
    const isInternal = request.headers.get("X-Remix-Auth-Internal")
    const somethingWentWrong =
      url.searchParams.has("csrf") && url.searchParams.get("csrf") === "true"
    let authResult: Response | undefined
    if (!providerId && isPost) {
      // IF POST, PROVIDER IS REQUIRED
      status.body = 'Missing "provider" parameter'
    } else if (!action || !actions.includes(action as AuthAction)) {
      // ACTION IS REQUIRED
      status.body = 'Invalid/Missing "action" parameter'
    } else if (somethingWentWrong) {
      status.body = "Something went wrong, perhaps a bad provider?"
    } else {
      // SEEMS VALID
      if (action === "callback") {
        // if a callback action we just let AuthJS handle it
        return await Auth(request, this.options)
      } else if ((!csrfToken || !isInternal) && isPost) {
        // IF IT IS A POST, fresh csrfToken IS REQUIRED
        // So figure out the path to the csrf endpoint
        const csrfPath =
          String(url.href).replace(`/${action}`, "/csrf").split("/csrf")[0] +
          "/csrf"
        const remixAuthRedirectUrl = new URL(csrfPath)
        const formData = await request.formData()
        // Set the form data as query params on the redirect url
        formData.forEach((val, key) => {
          if (typeof val === "string") {
            remixAuthRedirectUrl.searchParams.set(key, val)
          }
        })
        // and set the current path as the remixAuthRedirectUrl
        remixAuthRedirectUrl.searchParams.set("remixAuthRedirectUrl", url.href)
        remixAuthRedirectUrl.searchParams.set(
          "remixAuthRedirectUrlMethod",
          method
        )
        remixAuthRedirectUrl.searchParams.set("callbackUrl", callbackUrl)
        return redirect(remixAuthRedirectUrl.href, {
          headers: {
            "X-Remix-Auth-Internal": "1",
          },
        })
      } else if (
        csrfToken &&
        !isPost &&
        action &&
        providerId &&
        searchParams.get("remixAuthRedirectUrlMethod") === "POST"
      ) {
        // If we redirected a post request to get the csrfToken do the post request now
        url.searchParams.delete("remixAuthRedirectUrlMethod")
        url.searchParams.set("_data", "")
        const fetchUrl = new URL(url.origin + url.pathname)
        const fetchResult = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            Cookie: request.headers.get("Cookie") as string,
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Auth-Return-Redirect": "1",
            "X-Remix-Auth-Internal": "1",
          },
          body: url.searchParams,
        })
        const data = (await fetchResult.clone().json()) as { url: string }
        const error = new URL(data.url).searchParams.get("error")
        const redirectPost = getValue("redirect", searchParams, params) ?? true
        // TODO: Support custom providers
        const isCredentials = providerId === "credentials"
        const isEmail = providerId === "email"
        const isSupportingReturn = isCredentials || isEmail
        if ((redirectPost || !isSupportingReturn) && !error) {
          const mutableRes = new Response(fetchResult.body, fetchResult)
          mutableRes.headers.set("X-Remix-Auth-Internal", "1")
          mutableRes.headers.delete("Content-Type")
          const redirectUrl = new URL(data.url ?? callbackUrl)
          return redirect(redirectUrl.href, {
            ...mutableRes,
            status: 302,
            headers: mutableRes.headers,
          })
        }
        if (error) {
          this.options?.logger?.error
            ? this.options.logger.error(error)
            : console.error(error)

          authResult = new Response(fetchResult.body, { status: 500 })
        }
      } else if (isPost) {
        // other posts let Authjs handle it
        const result = await Auth(request, this.options)
        return result
      } else {
        // If we got here it is a get request so let auth handle, potentially with a redirect
        const result = await Auth(request, this.options)
        if (searchParams.has("remixAuthRedirectUrl")) {
          const remixAuthRedirectUrl = new URL(
            searchParams.get("remixAuthRedirectUrl")!
          )
          searchParams.delete("remixAuthRedirectUrl")
          searchParams.forEach((val, key) => {
            remixAuthRedirectUrl.searchParams.set(key, val)
          })
          const authJson = ((await result.clone().json()) || {}) as Record<
            string,
            any
          >
          Object.keys(authJson).forEach((key) => {
            remixAuthRedirectUrl.searchParams.set(key, authJson[key])
          })

          const mutableAuthResult = new Response(result.body, result)
          mutableAuthResult.headers.set("X-Remix-Auth-Internal", "1")
          mutableAuthResult.headers.delete("Content-Type")
          return redirect(remixAuthRedirectUrl.href, {
            ...mutableAuthResult,
            status: 302,
            headers: mutableAuthResult.headers,
          })
        } else {
          authResult = result
        }
      }
    }

    if (authResult) {
      if (
        !isPost &&
        !this.options.allowHtmlReturn &&
        authResult.status === 200 &&
        authResult.headers.get("Content-Type") === "text/html"
      ) {
        const redirectUrl = callbackUrl
          ? new URL(callbackUrl)
          : new URL(url.host)
        redirectUrl.searchParams.set("action", action)
        redirectUrl.searchParams.set(
          "provider",
          providerId ?? url.searchParams.get("provider") ?? ""
        )
        redirectUrl.searchParams.set("type", url.searchParams.get("type") ?? "")
        return redirect(redirectUrl.href, {})
      } else {
        return authResult
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw new Response(status.body, {
        status: status.status,
        statusText: status.body,
      })
    }
  }

  async getSession(req: Request): Promise<{ user?: User } | null> {
    const url = new URL("/api/auth/session", req.url)
    const request = new Request(url, { headers: req.headers })
    const response = await Auth(request, this.options)
    const { status = 200 } = response
    const data = (await response.json()) as {
      user?: User
      message?: string
      error?: string
    }

    if (!data || !Object.keys(data).length) return null
    if (status === 200) return data
    throw new Error(data?.message ?? data?.error ?? "Unknown error")
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
  ): Promise<User | null>
  async isAuthenticated(
    request: Request,
    options: { successRedirect: string; failureRedirect?: never }
  ): Promise<null>
  async isAuthenticated(
    request: Request,
    options: { successRedirect?: never; failureRedirect: string }
  ): Promise<User>
  async isAuthenticated(
    request: Request,
    options: { successRedirect: string; failureRedirect: string }
  ): Promise<null>
  async isAuthenticated(
    request: Request,
    options:
      | { successRedirect?: never; failureRedirect?: never }
      | { successRedirect: string; failureRedirect?: never }
      | { successRedirect?: never; failureRedirect: string }
      | { successRedirect: string; failureRedirect: string } = {}
  ): Promise<User | null> {
    const session = await this.getSession(request)

    if (session?.user) {
      if (options.successRedirect) throw redirect(options.successRedirect)
      else return session.user
    }

    if (options.failureRedirect) throw redirect(options.failureRedirect)
    else return null
  }

  async getProviders(req: Request): Promise<Record<string, Provider>> {
    const url = new URL("/api/auth/providers", req.url)
    const request = new Request(url, { headers: req.headers })
    const response = await Auth(request, this.options)
    const { status = 200 } = response
    const data = (await response.json()) as
      | Record<string, Provider>
      | {
          message?: string
          error?: string
        }
    if (!data || !Object.keys(data)?.length) return {}
    if (status === 200) return data as Record<string, Provider>
    throw new Error(
      (data?.message as string) || (data?.error as string) || "Unknown error"
    )
  }

  isValidAction(action: string | undefined): boolean {
    return action ? actions.includes(action as AuthAction) : false
  }
}
