import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ baseUrl, basePath, error, res }) => {
  const signinPageUrl = `${baseUrl}${basePath}/signin`

  let statusCode = 200
  let heading = <h1>Error</h1>
  let message = <p><a className='site' href={baseUrl}>{baseUrl.replace(/^https?:\/\//, '')}</a></p>

  switch (error) {
    case 'Signin':
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
    case 'OAuthAccountNotLinked':
    case 'EmailSignin':
    case 'CredentialsSignin':
      // These messages are displayed in line on the sign in page
      res.status(302).setHeader('Location', `${signinPageUrl}?error=${error}`)
      res.end()
      return false
    case 'Configuration':
      statusCode = 500
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
      statusCode = 403
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
      statusCode = 403
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

  res.status(statusCode)

  return render(
    <div className='error'>
      {heading}
      {message}
    </div>
  )
}
