import { Theme } from "../.."
import { InternalUrl } from "../../lib/parse-url"

export interface ErrorProps {
  url?: InternalUrl
  theme?: Theme
  error?: string
}

interface ErrorView {
  status: number
  heading: string
  message: JSX.Element
  signin?: JSX.Element
}

export type ErrorType =
  | "default"
  | "configuration"
  | "accessdenied"
  | "verification"

/** Renders an error page. */
export default function ErrorPage(props: ErrorProps) {
  const { url, error = "default", theme } = props
  const signinPageUrl = `${url}/signin`

  const errors: Record<ErrorType, ErrorView> = {
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
    configuration: {
      status: 500,
      heading: "Server error",
      message: (
        <div>
          <p>There is a problem with the server configuration.</p>
          <p>Check the server logs for more information.</p>
        </div>
      ),
    },
    accessdenied: {
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
    verification: {
      status: 403,
      heading: "Unable to sign in",
      message: (
        <div>
          <p>The sign in link is no longer valid.</p>
          <p>It may have been used already or it may have expired.</p>
        </div>
      ),
      signin: (
        <p>
          <a className="button" href={signinPageUrl}>
            Sign in
          </a>
        </p>
      ),
    },
  }

  const { status, heading, message, signin } =
    errors[error.toLowerCase()] ?? errors.default

  return {
    status,
    html: (
      <div className="error">
        <style
          dangerouslySetInnerHTML={{
            __html: `
        :root {
          --brand-color: ${theme?.brandColor};
        }
      `,
          }}
        />
        {theme?.logo && <img src={theme.logo} alt="Logo" className="logo" />}
        <div className="card">
          <h1>{heading}</h1>
          <div className="message">{message}</div>
          {signin}
        </div>
      </div>
    ),
  }
}
