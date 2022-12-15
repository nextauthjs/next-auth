import type { InternalProvider, Theme } from "../../index.js"

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

export default function SigninPage(props: SignInServerPageParams) {
  const {
    csrfToken,
    providers = [],
    callbackUrl,
    theme,
    email,
    error: errorType,
  } = props

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

  // TODO: move logos
  const logos =
    "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos"
  return (
    <div className="signin">
      {theme.brandColor && (
        <style
          dangerouslySetInnerHTML={{
            __html: `:root {--brand-color: ${theme.brandColor}}`,
          }}
        />
      )}
      {theme.logo && <img src={theme.logo} alt="Logo" className="logo" />}
      <div className="card">
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        {providers.map((provider, i) => (
          <div key={provider.id} className="provider">
            {provider.type === "oauth" || provider.type === "oidc" ? (
              <form action={provider.signinUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                {callbackUrl && (
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                )}
                <button
                  type="submit"
                  className="button"
                  style={{
                    "--provider-bg": provider.style?.bg ?? "",
                    "--provider-dark-bg": provider.style?.bgDark ?? "",
                    "--provider-color": provider.style?.text ?? "",
                    "--provider-dark-color": provider.style?.textDark ?? "",
                  }}
                >
                  {provider.style?.logo && (
                    <img
                      id="provider-logo"
                      src={`${
                        provider.style.logo.startsWith("/") ? logos : ""
                      }${provider.style.logo}`}
                    />
                  )}
                  {provider.style?.logoDark && (
                    <img
                      id="provider-logo-dark"
                      src={`${
                        provider.style.logo.startsWith("/") ? logos : ""
                      }${provider.style.logoDark}`}
                    />
                  )}
                  <span>Sign in with {provider.name}</span>
                </button>
              </form>
            ) : null}
            {(provider.type === "email" || provider.type === "credentials") &&
              i > 0 &&
              providers[i - 1].type !== "email" &&
              providers[i - 1].type !== "credentials" && <hr />}
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
                <button type="submit">Sign in with {provider.name}</button>
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
              i + 1 < providers.length && <hr />}
          </div>
        ))}
      </div>
    </div>
  )
}
