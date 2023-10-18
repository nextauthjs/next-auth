import type { InternalProvider, Theme } from "../types"
import type React from "react"

/**
 * The following errors are passed as error query parameters to the default or overridden sign-in page.
 *
 * [Documentation](https://next-auth.js.org/configuration/pages#sign-in-page) */
export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default"

export interface SignInServerPageParams {
  csrfToken: string
  providers: InternalProvider[]
  callbackUrl: string
  email: string
  error: SignInErrorTypes
  theme: Theme
}

function hexToRgba(hex?: string, alpha = 1) {
  if (!hex) {
    return
  }
  // Remove the "#" character if it's included
  hex = hex.replace(/^#/, "")

  // Expand 3-digit hex codes to their 6-digit equivalents
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  // Parse the hex value to separate R, G, and B components
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  // Ensure the alpha value is within the valid range [0, 1]
  alpha = Math.min(Math.max(alpha, 0), 1)

  // Construct the RGBA string
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`

  return rgba
}

export default function SigninPage(props: SignInServerPageParams) {
  const {
    csrfToken,
    providers,
    callbackUrl,
    theme,
    email,
    error: errorType,
  } = props
  // We only want to render providers
  const providersToRender = providers.filter((provider) => {
    if (provider.type === "oauth" || provider.type === "email") {
      // Always render oauth and email type providers
      return true
    } else if (provider.type === "credentials" && provider.credentials) {
      // Only render credentials type provider if credentials are defined
      return true
    }
    // Don't render other provider types
    return false
  })

  if (typeof document !== "undefined" && theme.buttonText) {
    document.documentElement.style.setProperty(
      "--button-text-color",
      theme.buttonText
    )
  }

  if (typeof document !== "undefined" && theme.brandColor) {
    document.documentElement.style.setProperty(
      "--brand-color",
      theme.brandColor
    )
  }

  const errors: Record<SignInErrorTypes, string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in.",
  }

  const error = errorType && (errors[errorType] ?? errors.default)

  const providerLogoPath = "https://authjs.dev/img/providers"
  return (
    <div className="signin">
      {theme.brandColor && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `,
          }}
        />
      )}
      {theme.buttonText && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `,
          }}
        />
      )}
      <div className="card">
        {theme.logo && <img src={theme.logo} alt="Logo" className="logo" />}
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        {providersToRender.map((provider, i: number) => {
          let bg, text, logo, logoDark, bgDark, textDark
          if (provider.type === "oauth") {
            ;({
              bg = "",
              text = "",
              logo = "",
              bgDark = bg,
              textDark = text,
              logoDark = "",
            } = provider.style ?? {})

            logo = logo.startsWith("/")
              ? `${providerLogoPath}${logo as string}`
              : logo
            logoDark = logoDark.startsWith("/")
              ? `${providerLogoPath}${logoDark as string}`
              : logoDark || logo

            logoDark ||= logo
          }
          return (
            <div key={provider.id} className="provider">
              {provider.type === "oauth" && (
                <form action={provider.signinUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  {callbackUrl && (
                    <input
                      type="hidden"
                      name="callbackUrl"
                      value={callbackUrl}
                    />
                  )}
                  <button
                    type="submit"
                    className="button"
                    style={
                      // eslint-disable-next-line
                      {
                        "--provider-bg": bg,
                        "--provider-dark-bg": bgDark,
                        "--provider-color": text,
                        "--provider-dark-color": textDark,
                        "--provider-bg-hover": hexToRgba(bg, 0.8),
                        "--provider-dark-bg-hover": hexToRgba(bgDark, 0.8),
                      } as React.CSSProperties
                    }
                  >
                    {logo && (
                      <img
                        loading="lazy"
                        height={24}
                        width={24}
                        id="provider-logo"
                        src={`${
                          logo.startsWith("/") ? providerLogoPath : ""
                        }${logo}`}
                      />
                    )}
                    {logoDark && (
                      <img
                        loading="lazy"
                        height={24}
                        width={24}
                        id="provider-logo-dark"
                        src={`${
                          logo.startsWith("/") ? providerLogoPath : ""
                        }${logoDark}`}
                      />
                    )}
                    <span>Sign in with {provider.name}</span>
                  </button>
                </form>
              )}
              {(provider.type === "email" || provider.type === "credentials") &&
                i > 0 &&
                providersToRender[i - 1].type !== "email" &&
                providersToRender[i - 1].type !== "credentials" && <hr />}
              {provider.type === "email" && (
                <form action={provider.signinUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  <label
                    className="section-header"
                    htmlFor={`input-email-for-${provider.id}-provider`}
                  >
                    Email
                  </label>
                  <input
                    id={`input-email-for-${provider.id}-provider`}
                    autoFocus
                    type="email"
                    name="email"
                    value={email}
                    placeholder="email@example.com"
                    required
                  />
                  <button id="submitButton" type="submit">
                    Sign in with {provider.name}
                  </button>
                </form>
              )}
              {provider.type === "credentials" && (
                <form action={provider.callbackUrl} method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  {Object.keys(provider.credentials).map((credential) => {
                    return (
                      <div key={`input-group-${provider.id}`}>
                        <label
                          className="section-header"
                          htmlFor={`input-${credential}-for-${provider.id}-provider`}
                        >
                          {provider.credentials[credential].label ?? credential}
                        </label>
                        <input
                          name={credential}
                          id={`input-${credential}-for-${provider.id}-provider`}
                          type={provider.credentials[credential].type ?? "text"}
                          placeholder={
                            provider.credentials[credential].placeholder ?? ""
                          }
                          {...provider.credentials[credential]}
                        />
                      </div>
                    )
                  })}
                  <button type="submit">Sign in with {provider.name}</button>
                </form>
              )}
              {(provider.type === "email" || provider.type === "credentials") &&
                i + 1 < providersToRender.length && <hr />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
