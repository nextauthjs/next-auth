import type {
  InternalProvider,
  SignInPageErrorParam,
  Theme,
} from "../../types.js"

const signinErrors: Record<
  Lowercase<SignInPageErrorParam | "default">,
  string
> = {
  default: "Unable to sign in.",
  signin: "Try signing in with a different account.",
  oauthsignin: "Try signing in with a different account.",
  oauthcallbackerror: "Try signing in with a different account.",
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
    error: errorType,
  } = props

  if (typeof document !== "undefined" && theme.brandColor) {
    document.documentElement.style.setProperty(
      "--brand-color",
      theme.brandColor
    )
  }

  if (typeof document !== "undefined" && theme.buttonText) {
    document.documentElement.style.setProperty(
      "--button-text-color",
      theme.buttonText
    )
  }

  const error =
    errorType &&
    (signinErrors[errorType.toLowerCase() as Lowercase<SignInPageErrorParam>] ??
      signinErrors.default)

  const providerLogos = "https://authjs.dev/img/providers"
  theme.providersLayout ||= "vertical"

  let oAuthProviders: InternalProvider[] = []
  let emailProviders: InternalProvider[] = []
  let credentialsProviders: InternalProvider[] = []
  providers.forEach((provider) => {
    if (provider.type === "oauth" || provider.type === "oidc") {
      oAuthProviders.push(provider)
    } else if (provider.type === "email") {
      emailProviders.push(provider)
    } else if (provider.type === "credentials") {
      credentialsProviders.push(provider)
    }
  })
  const isVertical = theme.providersLayout === "vertical"

  return (
    <div className="signin">
      {theme.brandColor && (
        <style
          dangerouslySetInnerHTML={{
            __html: `:root {--brand-color: ${theme.brandColor}}`,
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
        <div className="title">
          {theme.logo && <img src={theme.logo} alt="Logo" className="logo" />}
          <h1>{theme.brandName}</h1>
        </div>
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        {!isVertical && <p className="description">Sign in with:</p>}
        <div
          className={`oauth-providers ${
            isVertical ? "" : "oauth-providers__horizontal"
          }`}
        >
          {oAuthProviders.map((provider, i) => {
            let bg, text, logo, logoDark, bgDark, textDark
            if (provider.type === "oauth" || provider.type === "oidc") {
              ;({
                bg = "",
                text = "",
                logo = "",
                bgDark = bg,
                textDark = text,
                logoDark = "",
              } = provider.style ?? {})

              logo = logo.startsWith("/") ? providerLogos + logo : logo
              logoDark = logoDark.startsWith("/")
                ? providerLogos + logoDark
                : logoDark || logo

              logoDark ||= logo
            }
            return (
              <div
                key={provider.id}
                className="provider"
                style={{
                  width: isVertical ? "100%" : "auto",
                }}
              >
                {provider.type === "oauth" || provider.type === "oidc" ? (
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
                      tabIndex={1}
                      style={{
                        "--provider-bg": bg,
                        "--provider-dark-bg": bgDark,
                        "--provider-color": text,
                        "--provider-dark-color": textDark,
                        gap: 8,
                      }}
                    >
                      {logo && (
                        <img
                          loading="lazy"
                          height={24}
                          width={24}
                          id="provider-logo"
                          src={logo}
                        />
                      )}
                      {logoDark && (
                        <img
                          loading="lazy"
                          height={24}
                          width={24}
                          id="provider-logo-dark"
                          src={logoDark}
                        />
                      )}
                      {isVertical && <span>Sign in with {provider.name}</span>}
                    </button>
                  </form>
                ) : null}
                {(provider.type === "email" ||
                  provider.type === "credentials") &&
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
              </div>
            )
          })}
        </div>
        {emailProviders.length > 0 && (
          <div className="email-providers">
            {oAuthProviders.length > 0 && <hr />}
            {emailProviders.map((emailProvider) => (
              <form action={emailProvider.signinUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                <label
                  className="section-header"
                  htmlFor={`input-email-for-${emailProvider.id}-provider`}
                >
                  Email
                </label>
                <input
                  id={`input-email-for-${emailProvider.id}-provider`}
                  autoFocus
                  type="email"
                  name="email"
                  value={email}
                  placeholder="email@example.com"
                  required
                />
                <button type="submit">Sign in with {emailProvider.name}</button>
              </form>
            ))}
          </div>
        )}
        {credentialsProviders.length > 0 && (
          <div className="credentials-providers">
            {credentialsProviders.map((credentialProvider) => (
              <>
                {(oAuthProviders.length > 0 || emailProviders.length > 0) && (
                  <hr />
                )}
                {credentialProvider.type === "credentials" && (
                  <form action={credentialProvider.callbackUrl} method="POST">
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    {Object.keys(credentialProvider.credentials).map(
                      (credential) => {
                        return (
                          <div key={`input-group-${credentialProvider.id}`}>
                            <label
                              className="section-header"
                              htmlFor={`input-${credential}-for-${credentialProvider.id}-provider`}
                            >
                              {credentialProvider.credentials[credential]
                                .label ?? credential}
                            </label>
                            <input
                              name={credential}
                              id={`input-${credential}-for-${credentialProvider.id}-provider`}
                              type={
                                credentialProvider.credentials[credential]
                                  .type ?? "text"
                              }
                              placeholder={
                                credentialProvider.credentials[credential]
                                  .placeholder ?? ""
                              }
                              {...credentialProvider.credentials[credential]}
                            />
                          </div>
                        )
                      }
                    )}
                    <button id="submitButton" type="submit">
                      Sign in with {credentialProvider.name}
                    </button>
                  </form>
                )}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
