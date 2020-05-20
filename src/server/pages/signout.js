import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ baseUrl, csrfToken }) => {
  return render(
    <div className='signout'>
      <form action={`${baseUrl}/signout`} method='POST'>
        <input type='hidden' name='csrfToken' value={csrfToken} />
        <button type='submit'>Sign out</button>
      </form>
    </div>
  )
}
