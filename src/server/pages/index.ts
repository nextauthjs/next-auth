import renderToString from "preact-render-to-string"
import signin from "./signin"
import signout from "./signout"
import verifyRequest from "./verify-request"
import error from "./error"
import css from "../../css"
import { InternalOptions } from "../../lib/types"
import { OutgoingResponse } from ".."
import { Cookie } from "../lib/cookie"

/** Takes a request and response, and gives renderable pages */
export default function renderPage({
  options,
  query,
  cookies,
}: {
  options: InternalOptions
  query: Record<string, any>
  cookies: Cookie[]
}) {
  const { base, baseUrl, callbackUrl, csrfToken, providers, theme } = options

  function send({ html, title, status }: any): OutgoingResponse {
    return {
      cookies,
      status,
      headers: [{ key: "Content-Type", value: "text/html" }],
      text: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css()}</style><title>${title}</title></head><body class="__next-auth-theme-${
        theme.colorScheme
      }"><div class="page">${renderToString(html)}</div></body></html>`,
    }
  }

  return {
    signin(props?: any) {
      return send({
        html: signin({
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
        html: signout({ csrfToken, base, theme, ...props }),
        title: "Sign Out",
      })
    },
    verifyRequest(props?: any) {
      return send({
        html: verifyRequest({ baseUrl, theme, ...props }),
        title: "Verify Request",
      })
    },
    error(props) {
      return send({
        ...error({ base, baseUrl, theme, ...props }),
        title: "Error",
      })
    },
  }
}
