import type { InternalProvider, Theme } from "../../types.js"

interface VerifyOTPPageProps {
    url: URL
    theme: Theme
    identifier?: string
    verifyUrl?: string
    csrfToken: string
    // error?: SignInPageErrorParam
    providers: InternalProvider[]
    provider: InternalProvider['id']
}

export default function VerifyOTPPage(props: VerifyOTPPageProps) {
    const { url, theme, identifier, verifyUrl, csrfToken, providers, provider } = props
    if (!identifier || !verifyUrl || !provider) {
        // todo: improve this.
        return <div>
            invalid query params. need identifier and callback url
        </div>
    }

    const internalProvider = providers.find(p => p.id === provider)
    if (!internalProvider) {
        return <div>
            query provider id does not exist in providers
        </div>
    }
    else if (internalProvider.type !== 'otp') {
        return <div>
            wrong provider type.. how'd we end up here?
        </div>
    }

    // todo: implement better error handling
    return (
        <div className="verify-otp">
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
            <div className="card">
                {theme.logo && <img src={theme.logo} alt="Logo" className="logo" />}
                <form action={verifyUrl} method="POST">
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <input type="hidden" name="identifier" value={identifier} />
                    <div>
                        <label
                            className="section-header"
                            htmlFor='otp-input'
                        >
                            {internalProvider.identifierInput.label ?? internalProvider.name}
                        </label>

                        <input
                            name="token"
                            id={`identifier-input-for-${internalProvider.id}-provider`}
                            type={internalProvider.identifierInput.type ?? "text"}
                            placeholder={
                                internalProvider.identifierInput.placeholder ?? ""
                            }
                            // todo: fix this override
                            {...internalProvider.identifierInput as any}
                        />
                    </div>
                    <button type="submit">
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    )
}
