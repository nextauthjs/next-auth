import { h } from 'preact' // eslint-disable-line no-unused-vars

export default function signout ({ baseUrl, basePath, csrfToken }) {
  return (
    <div className='signout'>
      <h1>Are you sure you want to sign out?</h1>
      <form action={`${baseUrl}${basePath}/signout`} method='POST'>
        <input type='hidden' name='csrfToken' value={csrfToken} />
        <button type='submit'>Sign out</button>
      </form>
    </div>
  )
}
