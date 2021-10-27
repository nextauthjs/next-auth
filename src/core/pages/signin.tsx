export default function SigninPage(props) {
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

  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      "--brand-color",
      theme.brandColor
    )
  }

  const errors = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email inbox.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  }

  const error = errorType && (errors[errorType] ?? errors.default)

  return (
    <div className="signin">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `,
        }}
      />
      {theme.logo && <img src={theme.logo} alt="Logo" className="logo" />}
      <div className="card">
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        {providersToRender.map((provider, i: number) => (
          <div key={provider.id} className="provider">
            {provider.type === "oauth" && (
              <form action={provider.signinUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                {callbackUrl && (
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                )}
                <button type="submit" className="button">
                  Sign in with {provider.name}
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
                  type="text"
                  name="email"
                  value={email}
                  placeholder="email@example.com"
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
                        {provider.credentials[credential].label || credential}
                      </label>
                      <input
                        name={credential}
                        id={`input-${credential}-for-${provider.id}-provider`}
                        type={provider.credentials[credential].type || "text"}
                        placeholder={
                          provider.credentials[credential].placeholder ||
                          "Password"
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
        ))}
      </div>
    </div>
  )
}
