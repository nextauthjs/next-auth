import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

/** Renders an error page. */
export default function error ({ baseUrl, basePath, error, res }) {
  const signinPageUrl = `${baseUrl}${basePath}/signin`

  const errors = {
    default: {
      statusCode: 200,
      heading: 'Error',
      message: <p><a className='site' href={baseUrl}>{baseUrl.replace(/^https?:\/\//, '')}</a></p>
    },
    configuration: {
      statusCode: 500,
      heading: 'Server error',
      message: (
        <div>
          <p>There is a problem with the server configuration.</p>
          <p>Check the server logs for more information.</p>
        </div>
      )
    },
    accessdenied: {
      statusCode: 403,
      heading: 'Access Denied',
      message: (
        <div>
          <p>You do not have permission to sign in.</p>
          <p><a className='button' href={signinPageUrl}>Sign in</a></p>
        </div>
      )
    },
    verification: {
      statusCode: 403,
      heading: 'Unable to sign in',
      message: (
        <div>
          <p>The sign in link is no longer valid.</p>
          <p>It may have be used already or it may have expired.</p>
        </div>
      ),
      signin: <p><a className='button' href={signinPageUrl}>Sign in</a></p>
    }
  }

  const { statusCode, heading, message, signin } = errors[error.toLowerCase()] || errors.default

  res.status(statusCode)

  return render(
    <div className='error'>
      <h1>{heading}</h1>
      <div className='message'>{message}</div>
      {signin}
    </div>
  )
}
