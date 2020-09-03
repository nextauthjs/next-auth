import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'

export default ({ baseUrl }) => {
  return render(
    <div className='verify-request'>
      <h1>Check your email</h1>
      <p>A sign in link has been sent to your email address.</p>
      <p><a className='site' href={baseUrl}>{baseUrl.replace(/^https?:\/\//, '')}</a></p>
    </div>
  )
}
