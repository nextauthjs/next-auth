import renderToString from "preact-render-to-string"
import SigninPage from "./signin"
import SignoutPage from "./signout"
import VerifyRequestPage from "./verify-request"
import ErrorPage from "./error"
import css from "../../css"
import { InternalOptions } from "../../lib/types"
import { IncomingRequest, OutgoingResponse } from ".."
import { Cookie } from "../lib/cookie"

/** Takes a request and response, and gives renderable pages */
export default function renderPage({
  options,
  query,
  cookies,
}: {
  options: InternalOptions
  query: IncomingRequest["query"]
  cookies: Cookie[]
}) {
  const { url, callbackUrl, csrfToken, providers, theme } = options

  function send({ html, title, status }: any): OutgoingResponse {
    return {
      cookies,
      status,
      headers: [{ key: "Content-Type", value: "text/html" }],
      body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css()}</style><title>${title}</title></head><body class="__next-auth-theme-${
        theme.colorScheme
      }"><div class="page">${renderToString(html)}</div></body></html>`,
    }
  }

  return {
    signin(props?: any) {
      return send({
        html: SigninPage({
          csrfToken,
          providers,
          callbackUrl,
          theme,
          ...query,
          ...props,
        }),
        title: "Sign In",
      })
    },
    signout(props?: any) {
      return send({
        html: SignoutPage({ csrfToken, url, theme, ...props }),
        title: "Sign Out",
      })
    },
    verifyRequest(props?: any) {
      return send({
        html: VerifyRequestPage({ url, theme, ...props }),
        title: "Verify Request",
      })
    },
    error(props?: any) {
      return send({
        ...ErrorPage({ url, theme, ...props }),
        title: "Error",
      })
    },
  }
}
