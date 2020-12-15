import { h } from 'preact' // eslint-disable-line no-unused-vars
import render from 'preact-render-to-string'
import baseUrl from '../../lib/baseUrl'

export default function verifyRequest () {
  return render(
    <div className='verify-request'>
      <h1>Check your email</h1>
      <p>A sign in link has been sent to your email address.</p>
      <p><a className='site' href={baseUrl().origin}>{baseUrl().host}</a></p>
    </div>
  )
}
