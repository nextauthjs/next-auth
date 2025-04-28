import { renderToString } from "preact-render-to-string"
import ErrorPage from "./error.js"
import SigninPage from "./signin.js"
import SignoutPage from "./signout.js"
import css from "./styles.js"
import VerifyRequestPage from "./verify-request.js"
import { UnknownAction } from "../../errors.js"

import type {
  InternalOptions,
  RequestInternal,
  ResponseInternal,
  InternalProvider,
  PublicProvider,
} from "../../types.js"
import type { Cookie } from "../utils/cookie.js"

function send({
  html,
  title,
  status,
  cookies,
  theme,
  headTags,
}: any): ResponseInternal {
  return {
    cookies,
    status,
    headers: { "Content-Type": "text/html" },
    body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style><title>${title}</title>${
      headTags ?? ""
    }</head><body class="__next-auth-theme-${
      theme?.colorScheme ?? "auto"
    }"><div class="page">${renderToString(html)}</div></body></html>`,
  }
}

type RenderPageParams = {
  query?: RequestInternal["query"]
  cookies?: Cookie[]
} & Partial<
  Pick<
    InternalOptions,
    "url" | "callbackUrl" | "csrfToken" | "providers" | "theme" | "pages"
  >
>

/**
 * Unless the user defines their [own pages](https://authjs.dev/reference/core#pages),
 * we render a set of default ones, using Preact SSR.
 */
export default function renderPage(params: RenderPageParams) {
  const { url, theme, query, cookies, pages, providers } = params

  return {
    csrf(skip: boolean, options: InternalOptions, cookies: Cookie[]) {
      if (!skip) {
        return {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "private, no-cache, no-store",
            Expires: "0",
            Pragma: "no-cache",
          },
          body: { csrfToken: options.csrfToken },
          cookies,
        }
      }
      options.logger.warn("csrf-disabled")
      cookies.push({
        name: options.cookies.csrfToken.name,
        value: "",
        options: { ...options.cookies.csrfToken.options, maxAge: 0 },
      })
      return { status: 404, cookies }
    },
    providers(providers: InternalProvider[]) {
      return {
        headers: { "Content-Type": "application/json" },
        body: providers.reduce<Record<string, PublicProvider>>(
          (acc, { id, name, type, signinUrl, callbackUrl }) => {
            acc[id] = { id, name, type, signinUrl, callbackUrl }
            return acc
          },
          {}
        ),
      }
    },
    signin(providerId?: string, error?: any) {
      if (providerId) throw new UnknownAction("Unsupported action")
      if (pages?.signIn) {
        let signinUrl = `${pages.signIn}${
          pages.signIn.includes("?") ? "&" : "?"
        }${new URLSearchParams({ callbackUrl: params.callbackUrl ?? "/" })}`
        if (error) signinUrl = `${signinUrl}&${new URLSearchParams({ error })}`
        return { redirect: signinUrl, cookies }
      }

      // If we have a webauthn provider with conditional UI and
      // a simpleWebAuthnBrowserScript is defined, we need to
      // render the script in the page.
      const webauthnProvider = providers?.find(
        (p): p is InternalProvider<"webauthn"> =>
          p.type === "webauthn" &&
          p.enableConditionalUI &&
          !!p.simpleWebAuthnBrowserVersion
      )

      let simpleWebAuthnBrowserScript = ""
      if (webauthnProvider) {
        const { simpleWebAuthnBrowserVersion } = webauthnProvider
        simpleWebAuthnBrowserScript = `<script src="https://unpkg.com/@simplewebauthn/browser@${simpleWebAuthnBrowserVersion}/dist/bundle/index.umd.min.js" crossorigin="anonymous"></script>`
      }

      return send({
        cookies,
        theme,
        html: SigninPage({
          csrfToken: params.csrfToken,
          // We only want to render providers
          providers: params.providers?.filter(
            (provider) =>
              // Always render oauth and email type providers
              ["email", "oauth", "oidc"].includes(provider.type) ||
              // Only render credentials type provider if credentials are defined
              (provider.type === "credentials" && provider.credentials) ||
              // Only render webauthn type provider if formFields are defined
              (provider.type === "webauthn" && provider.formFields) ||
              // Don't render other provider types
              false
          ),
          callbackUrl: params.callbackUrl,
          theme: params.theme,
          error,
          ...query,
        }),
        title: "Sign In",
        headTags: simpleWebAuthnBrowserScript,
      })
    },
    signout() {
      if (pages?.signOut) return { redirect: pages.signOut, cookies }
      return send({
        cookies,
        theme,
        html: SignoutPage({ csrfToken: params.csrfToken, url, theme }),
        title: "Sign Out",
      })
    },
    verifyRequest(props?: any) {
      if (pages?.verifyRequest)
        return {
          redirect: `${pages.verifyRequest}${url?.search ?? ""}`,
          cookies,
        }
      return send({
        cookies,
        theme,
        html: VerifyRequestPage({ url, theme, ...props }),
        title: "Verify Request",
      })
    },
    error(error?: string) {
      if (pages?.error) {
        return {
          redirect: `${pages.error}${
            pages.error.includes("?") ? "&" : "?"
          }error=${error}`,
          cookies,
        }
      }
      return send({
        cookies,
        theme,
        // @ts-expect-error fix error type
        ...ErrorPage({ url, theme, error }),
        title: "Error",
      })
    },
  }
}
