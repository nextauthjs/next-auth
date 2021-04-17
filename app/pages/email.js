import * as React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import Layout from 'components/layout'

export default function Page () {
  const [response, setResponse] = React.useState(null)
  const [email, setEmail] = React.useState('')

  const handleChange = (event) => {
    setEmail(event.target.value)
  }

  const handleLogin = (options) => async (event) => {
    event.preventDefault()

    if (options.redirect) {
      return signIn('email', options)
    }
    const response = await signIn('email', options)
    setResponse(response)
  }

  const handleLogout = (options) => async (event) => {
    if (options.redirect) {
      return signOut(options)
    }
    const response = await signOut(options)
    setResponse(response)
  }

  const [session] = useSession()

  if (session) {
    return (
      <Layout>
        <h1>Test different flows for Email logout</h1>
        <span className='spacing'>Default:</span>
        <button onClick={handleLogout({ redirect: true })}>Logout</button><br />
        <span className='spacing'>No redirect:</span>
        <button onClick={handleLogout({ redirect: false })}>Logout</button><br />
        <p>Response:</p>
        <pre style={{ background: '#eee', padding: 16 }}>{JSON.stringify(response, null, 2)}</pre>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>Test different flows for Email login</h1>
      <label className='spacing'>
        Email address:{' '}
        <input type='text' id='email' name='email' value={email} onChange={handleChange} />
      </label><br />
      <form onSubmit={handleLogin({ redirect: true, email })}>
        <span className='spacing'>Default:</span>
        <button type='submit'>Sign in with Email</button>
      </form>
      <form onSubmit={handleLogin({ redirect: false, email })}>
        <span className='spacing'>No redirect:</span>
        <button type='submit'>Sign in with Email</button>
      </form>
      <p>Response:</p>
      <pre style={{ background: '#eee', padding: 16 }}>{JSON.stringify(response, null, 2)}</pre>
    </Layout>
  )
}
