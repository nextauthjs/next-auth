export default function VerifyRequest({ baseUrl, theme }) {
  return (
    <div className="verify-request">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `}} />
      <img src={theme.logo} alt="Logo" className="logo" />
      <div className="card">
        <h1>Check your email</h1>
        <p>A sign in link has been sent to your email address.</p>
        <p>
          <a className="site" href={baseUrl}>
            {baseUrl.replace(/^https?:\/\//, "")}
          </a>
        </p>
      </div>
    </div>
  )
}
