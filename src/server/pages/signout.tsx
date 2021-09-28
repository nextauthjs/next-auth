export default function Signout({ baseUrl, basePath, csrfToken, theme }) {
  return (
    <div className="signout">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `}} />
      <img src={theme.logo} alt="Logo" className="logo" />
      <div className="card">
        <h1>Signout</h1>
        <p>Are you sure you want to sign out?</p>
        <form action={`${baseUrl}${basePath}/signout`} method="POST">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <button type="submit">Sign out</button>
        </form>
      </div>
    </div>
  )
}
