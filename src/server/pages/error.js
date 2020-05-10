import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ site, error, urlPrefix }) => {
  const signinPageUrl = `${urlPrefix}/signin` // @TODO Make sign in URL configurable

  let heading = <h1>An error occured</h1>
  let message = <p><a className='site' href={site}>{site.replace(/^https?:\/\//, '')}</a></p>
  
  switch (error) {
    case 'SIGNUP_ACCOUNT_EXISTS':
      heading = <h1>Sign in with another account</h1>
      message = <div>
        <div className='message'>
          <p>It looks like you previously signed in using another account.</p>
          <p>Use the same service you used originally to verify your identity.</p>
          <p>Once you are signed in, you can link your accounts.</p>
        </div>
        <p><a className='button' href={signinPageUrl}>Sign in</a></p>
      </div>
      break
    default:
  }

  return render(
    <div className='error'>
      {heading}
      {message}
    </div>
  )
}