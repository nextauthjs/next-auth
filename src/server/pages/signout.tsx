export interface SignOutServerPageParams {
  csrfToken: string
  baseUrl: string
  basePath: string
}

export default function Signout({ baseUrl, basePath, csrfToken }: SignOutServerPageParams) {
  return (
    <div className="signout">
      <h1>Are you sure you want to sign out?</h1>
      <form action={`${baseUrl}${basePath}/signout`} method="POST">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <button type="submit">Sign out</button>
      </form>
    </div>
  )
}
