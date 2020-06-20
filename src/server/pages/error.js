import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ site, error, baseUrl }) => {
  const signinPageUrl = `${baseUrl}/signin` // @TODO Make sign in URL configurable

  let heading = <h1>Error</h1>
  let message = <p><a className='site' href={site}>{site.replace(/^https?:\/\//, '')}</a></p>

  switch (error) {
    case 'Signin':
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
      heading = <h1>Sign in failed</h1>
      message =
        <div>
          <div className='message'>
            <p>Try signing with a different account.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      break
    case 'OAuthAccountNotLinked':
      heading = <h1>Sign in failed</h1>
      message =
        <div>
          <div className='message'>
            <p>An account associated with your email address already exists.</p>
            <p>Sign in with the same account you used originally to confirm your identity.</p>
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
            <p>Unable to send email.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      break
    case 'CredentialsSignin':
      heading = <h1>Sign in failed</h1>
      message =
        <div>
          <div className='message'>
            <p>Check the details you provided are correct.</p>
          </div>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      break
    case 'Configuration':
      heading = <h1>Server error</h1>
      message =
        <div>
          <div className='message'>
            <p>There is a problem with the server configuration.</p>
            <p>Check the server logs for more information.</p>
          </div>
        </div>
      break
    case 'AccessDenied':
      heading = <h1>Access Denied</h1>
      message =
        <div>
          <div className='message'>
            <p>You do not have permission to sign in.</p>
            <p><a className='button' href={signinPageUrl}>Sign in</a></p>
          </div>
        </div>
      break
    case 'Verification':
      // @TODO Check if user is signed in already with the same email address.
      // If they are, no need to display this message, can just direct to callbackUrl
      heading = <h1>Unable to sign in</h1>
      message =
        <div>
          <div className='message'>
            <p>The sign in link is no longer valid.</p>
            <p>It may have be used already or it may have expired.</p>
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
