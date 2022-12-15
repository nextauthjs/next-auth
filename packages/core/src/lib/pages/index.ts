import { renderToString } from "preact-render-to-string"
import css from "../styles/index.js"
import ErrorPage from "./error.js"
import SigninPage from "./signin.js"
import SignoutPage from "./signout.js"
import VerifyRequestPage from "./verify-request.js"

import type {
  InternalOptions,
  RequestInternal,
  ResponseInternal,
} from "../../index.js"
import type { Cookie } from "../cookie.js"
import type { ErrorType } from "./error.js"

type RenderPageParams = {
  query?: RequestInternal["query"]
  cookies?: Cookie[]
} & Partial<
  Pick<
    InternalOptions,
    "url" | "callbackUrl" | "csrfToken" | "providers" | "theme"
  >
>

/**
 * Unless the user defines their [own pages](https://next-auth.js.org/configuration/pages),
 * we render a set of default ones, using Preact SSR.
 */
export default function renderPage(params: RenderPageParams) {
  const { url, theme, query, cookies } = params

  function send({ html, title, status }: any): ResponseInternal {
    return {
      cookies,
      status,
      headers: { "Content-Type": "text/html" },
      body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style><title>${title}</title></head><body class="__next-auth-theme-${
        theme?.colorScheme ?? "auto"
      }"><div class="page">${renderToString(html)}</div></body></html>`,
    }
  }

  return {
    signin(props?: any) {
      return send({
        html: SigninPage({
          csrfToken: params.csrfToken,
          // We only want to render providers
          providers: params.providers?.filter(
            (provider) =>
              // Always render oauth and email type providers
              ["email", "oauth", "oidc"].includes(provider.type) ||
              // Only render credentials type provider if credentials are defined
              (provider.type === "credentials" && provider.credentials) ||
              // Don't render other provider types
              false
          ),
          callbackUrl: params.callbackUrl,
          theme,
          ...query,
          ...props,
        }),
        title: "Sign In",
      })
    },
    signout(props?: any) {
      return send({
        html: SignoutPage({
          csrfToken: params.csrfToken,
          url,
          theme,
          ...props,
        }),
        title: "Sign Out",
      })
    },
    verifyRequest(props?: any) {
      return send({
        html: VerifyRequestPage({ url, theme, ...props }),
        title: "Verify Request",
      })
    },
    error(props?: { error?: ErrorType }) {
      return send({
        ...ErrorPage({ url, theme, ...props }),
        title: "Error",
      })
    },
  }
}
