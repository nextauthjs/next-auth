import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ urlPrefix, csrfToken }) => {
  return render(
    <div className='signout'>
      <form action={`${urlPrefix}/signout`} method='POST'>
        <input type='hidden' name='csrfToken' value={csrfToken}/>
        <button type='submit'>Sign out</button>
      </form>
    </div>
  )
}
