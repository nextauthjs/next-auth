import type { Theme } from "../../types.js"

interface VerifyRequestPageProps {
  url: URL
  theme: Theme
}

export default function VerifyRequestPage(props: VerifyRequestPageProps) {
  const { url, theme } = props

  return (
    <div className="verify-request">
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
        <h1>Check your email</h1>
        <p>A sign in link has been sent to your email address.</p>
        <p>
          <a className="site" href={url.origin}>
            {url.host}
          </a>
        </p>
      </div>
    </div>
  )
}
