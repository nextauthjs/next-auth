import { h } from 'preact' // eslint-disable-line no-unused-vars

export default function verifyRequest ({ baseUrl, locale }) {
  return (
    <div className='verify-request'>
      <h1>Check your email</h1>
      <p>A sign in link has been sent to your email address.</p>
      <p><a className='site' href={baseUrl}>{baseUrl.replace(/^https?:\/\//, '')}</a></p>
      <p>Locale: {locale || 'N/A'}</p>
    </div>
  )
}
