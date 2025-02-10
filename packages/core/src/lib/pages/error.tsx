import type { ErrorPageParam, Theme } from "../../types.js"

/**
 * The following errors are passed as error query parameters to the default or overridden error page.
 *
 * [Documentation](https://authjs.dev/guides/pages/error)
 */

export interface ErrorProps {
  url?: URL
  theme?: Theme
  error?: ErrorPageParam
}

interface ErrorView {
  status: number
  heading: string
  message: JSX.Element
  signin?: JSX.Element
}

/** Renders an error page. */
export default function ErrorPage(props: ErrorProps) {
  const { url, error = "default", theme } = props
  const signinPageUrl = `${url}/signin`

  const errors: Record<ErrorPageParam | "default", ErrorView> = {
    default: {
      status: 200,
      heading: "Error",
      message: (
        <p>
          <a className="site" href={url?.origin}>
            {url?.host}
          </a>
        </p>
      ),
    },
    Configuration: {
      status: 500,
      heading: "Server error",
      message: (
        <div>
          <p>There is a problem with the server configuration.</p>
          <p>Check the server logs for more information.</p>
        </div>
      ),
    },
    AccessDenied: {
      status: 403,
      heading: "Access Denied",
      message: (
        <div>
          <p>You do not have permission to sign in.</p>
          <p>
            <a className="button" href={signinPageUrl}>
              Sign in
            </a>
          </p>
        </div>
      ),
    },
    Verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <div>
          <p>The sign in link is no longer valid.</p>
          <p>It may have been used already or it may have expired.</p>
        </div>
      ),
      signin: (
        <a className="button" href={signinPageUrl}>
          Sign in
        </a>
      ),
    },
  }

  const { status, heading, message, signin } = errors[error] ?? errors.default

  return {
    status,
    html: (
      <div className="error">
        {theme?.brandColor && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
        :root {
          --brand-color: ${theme?.brandColor}
        }
      `,
            }}
          />
        )}
        <div className="card">
          {theme?.logo && <img src={theme?.logo} alt="Logo" className="logo" />}
          <h1>{heading}</h1>
          <div className="message">{message}</div>
          {signin}
        </div>
      </div>
    ),
  }
}
