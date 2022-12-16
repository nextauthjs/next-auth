import type {
  InternalProvider,
  SignInPageErrorParam,
  Theme,
} from "../../index.js"

const signinErrors: Record<
  Lowercase<SignInPageErrorParam | "default">,
  string
> = {
  default: "Unable to sign in.",
  signin: "Try signing in with a different account.",
  oauthsignin: "Try signing in with a different account.",
  oauthcallback: "Try signing in with a different account.",
  oauthcreateaccount: "Try signing in with a different account.",
  emailcreateaccount: "Try signing in with a different account.",
  callback: "Try signing in with a different account.",
  oauthaccountnotlinked:
    "To confirm your identity, sign in with the same account you used originally.",
  emailsignin: "The e-mail could not be sent.",
  credentialssignin:
    "Sign in failed. Check the details you provided are correct.",
  sessionrequired: "Please sign in to access this page.",
}

export default function SigninPage(props: {
  csrfToken: string
  providers: InternalProvider[]
  callbackUrl: string
  email: string
  error?: SignInPageErrorParam
  theme: Theme
}) {
  const {
    csrfToken,
    providers = [],
    callbackUrl,
    theme,
    email,
    error: errorParam,
  } = props

  if (typeof document !== "undefined" && theme.brandColor) {
    document.documentElement.style.setProperty(
      "--brand-color",
      theme.brandColor
    )
  }

  const error =
    errorParam &&
    (signinErrors[errorParam.toLowerCase()] ?? signinErrors.default)

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
        {providers.map((p, i) => (
          <div key={p.id} className="provider">
            {p.type === "oauth" || p.type === "oidc" ? (
              <form action={p.signinUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                {callbackUrl && (
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                )}
                <button
                  type="submit"
                  className="button"
                  style={{
                    "--provider-bg": p.style?.bg ?? "",
                    "--provider-dark-bg": p.style?.bgDark ?? "",
                    "--provider-color": p.style?.text ?? "",
                    "--provider-dark-color": p.style?.textDark ?? "",
                  }}
                >
                  {p.style?.logo && (
                    <img
                      id="provider-logo"
                      src={`${p.style.logo.startsWith("/") ? logos : ""}${
                        p.style.logo
                      }`}
                    />
                  )}
                  {p.style?.logoDark && (
                    <img
                      id="provider-logo-dark"
                      src={`${p.style.logo.startsWith("/") ? logos : ""}${
                        p.style.logoDark
                      }`}
                    />
                  )}
                  <span>Sign in with {p.name}</span>
                </button>
              </form>
            ) : null}
            {(p.type === "email" || p.type === "credentials") &&
              i > 0 &&
              providers[i - 1].type !== "email" &&
              providers[i - 1].type !== "credentials" && <hr />}
            {p.type === "email" && (
              <form action={p.signinUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                <label
                  className="section-header"
                  htmlFor={`input-email-for-${p.id}-provider`}
                >
                  Email
                </label>
                <input
                  id={`input-email-for-${p.id}-provider`}
                  autoFocus
                  type="email"
                  name="email"
                  value={email}
                  placeholder="email@example.com"
                  required
                />
                <button type="submit">Sign in with {p.name}</button>
              </form>
            )}
            {p.type === "credentials" && (
              <form action={p.callbackUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                {Object.keys(p.credentials).map((credential) => {
                  return (
                    <div key={`input-group-${p.id}`}>
                      <label
                        className="section-header"
                        htmlFor={`input-${credential}-for-${p.id}-provider`}
                      >
                        {p.credentials[credential].label ?? credential}
                      </label>
                      <input
                        name={credential}
                        id={`input-${credential}-for-${p.id}-provider`}
                        type={p.credentials[credential].type ?? "text"}
                        placeholder={
                          p.credentials[credential].placeholder ?? ""
                        }
                        {...p.credentials[credential]}
                      />
                    </div>
                  )
                })}
                <button type="submit">Sign in with {p.name}</button>
              </form>
            )}
            {(p.type === "email" || p.type === "credentials") &&
              i + 1 < providers.length && <hr />}
          </div>
        ))}
      </div>
    </div>
  )
}
