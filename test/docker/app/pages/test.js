import { useSession } from 'next-auth/client'

export default function TestPage () {
  const [ session, loading ] = useSession()

  return (
    <div id='nextauth-test-page'>
      <h1>NextAuth.js Test Page</h1>
      {session && <p id="nextauth-signed-in">Signed in</p>}
      {!session && !loading && <p id="nextauth-signed-out">Signed out</p>}
    </div>
  )
}
