import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ site, error, urlPrefix }) => {
  const signinPageUrl = `${urlPrefix}/signin` // @TODO Make sign in URL configurable

  let heading = <h1>An error occured</h1>
  let message = <p><a className='site' href={site}>{site.replace(/^https?:\/\//, '')}</a></p>

  switch (error) {
    case 'Signin':
      heading = <h1>Sign in with another account</h1>
      message =
        <div>
          <div className='message'>
            <p>It seems like you previously signed in with a different account.</p>
            <p>Sign in with the same account you used originally to verify your identity.</p>
            <p>Once you are signed in, you can link your accounts.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      break
    case 'Verification':
      // @TODO Check if user is signed in already with the same email address
      // If they are, no need to display this message, can just direct to callbackUrl
      heading = <h1>Sign in link invalid</h1>
      message =
        <div>
          <div className='message'>
            <p>The link you used may have been used already or it may have expired.</p>
            <p>Sign in links can only be used once, you can a new sign in link at any time.</p>
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
