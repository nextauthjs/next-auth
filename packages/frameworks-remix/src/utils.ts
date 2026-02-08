import type { DataFunctionArgs } from "@remix-run/server-runtime"

export const getBody = async (
  req: Request
): Promise<Record<string, any> | undefined> => {
  if (!("body" in req) || !req.body || req.method !== "POST") return

  const contentType = req.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await req.json()
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(await req.text())
    return Object.fromEntries(params)
  }
}

export const getValue = (
  key: string,
  searchParams: URLSearchParams,
  params?: DataFunctionArgs["params"]
): string | undefined => {
  return searchParams.get(key) ?? params?.[key]
}

export function authjsDefaultCookies(useSecureCookies: boolean) {
  const cookiePrefix = useSecureCookies ? "__Secure-" : ""
  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
    },
  }
}
