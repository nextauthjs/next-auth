import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ site, error, baseUrl }) => {
  const signinPageUrl = `${baseUrl}/signin` // @TODO Make sign in URL configurable

  let heading = <h1>Error</h1>
  let message = <p><a className='site' href={site}>{site.replace(/^https?:\/\//, '')}</a></p>

  switch (error) {
    case 'Signin':
    case 'oAuthSignin':
    case 'oAuthCallback':
    case 'oAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
      heading = <h1>Sign in failed</h1>
      message =
        <div>
          <div className='message'>
            <p>Something went wrong trying to sign in.</p>
            <p>Try signing in with a different account.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      break
    case 'oAuthAccountNotLinked':
      heading = <h1>Sign in with another account</h1>
      message =
        <div>
          <div className='message'>
            <p>You might have signed in before with a different account.</p>
            <p>Sign in the same account you used originally to confirm your identity.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      // @TODO Add this text when account linking is complete
      // <p>Once you are signed in, you can link your accounts.</p>
      // @TODO Display email sign in option if an email provider is configured
      break
    case 'EmailSignin':
      heading = <h1>Sign in failed</h1>
      message =
        <div>
          <div className='message'>
            <p>Unable to send email to your address.</p>
            <p>You can try signing in again with a different account.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      break
    case 'Verification':
      // @TODO Check if user is signed in already with the same email address.
      // If they are, no need to display this message, can just direct to callbackUrl
      heading = <h1>Sign in failed</h1>
      message =
        <div>
          <div className='message'>
            <p>The link you followed may have been used already or it may have expired.</p>
            <p>Sign in links can only be used once and expire, you can a new sign in link at any time.</p>
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
