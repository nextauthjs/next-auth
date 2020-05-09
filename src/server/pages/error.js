import { h } from 'preact'
import render from 'preact-render-to-string'

export default ({ site, error, urlPrefix }) => {
  const signinPageUrl = `${urlPrefix}/signin` // @TODO Make sign in URL configurable

  let heading = <h1>An error occured</h1>
  let message = <p>error</p>

  switch (error) {
    case 'SIGNUP_ACCOUNT_EXISTS':
      heading = <h1>Sign in with another account</h1>
      message = <div className='message'>
        <p>It looks like you previously signed in using another account.</p>
        <p>Sign in with the same service you used originally to verify your identity.</p>
        <p>Once you are signed in, you can link your accounts.</p>
      </div>
      break
    default:
      return
  }

  return render(
    <div className='error'>
      {heading}
      {message}
      <p><a className='button' href={signinPageUrl}>Sign in</a></p>
    </div>
  )
}