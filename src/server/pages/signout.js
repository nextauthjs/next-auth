import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ site, urlPrefix, csrfToken, callbackUrl }) => {
  return render(
    <div className='signout'>
      <p><a className='site' href={site}>{site.replace(/^https?:\/\//, '')}</a></p>
      <form action={`${urlPrefix}/signout`} method='POST'>
        <input type='hidden' name='csrfToken' value={csrfToken}/>
        <button type='submit'>Sign out</button>
      </form>
    </div>
  )
}
