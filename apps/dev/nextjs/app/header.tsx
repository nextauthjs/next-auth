import { auth } from "auth"
import { cookies, headers } from "next/headers"
import Link from "next/link"
import styles from "./header.module.css"

function SignIn({ id, ...props }: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  const action = id ? `/api/auth/signin/${id}` : "/api/auth/signin"
  return (
    <form action={action} method="post">
      <button {...props} />
      <input type="hidden" name="csrfToken" value={csrfToken} />
    </form>
  )
}

function SignOut(props: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  return (
    <form action="/api/auth/signout" method="post">
      <button {...props} />
      <input type="hidden" name="csrfToken" value={csrfToken} />
    </form>
  )
}

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default async function Header() {
  const session = await auth(headers())
  return (
    <header>
      <div className={styles.signedInStatus}>
        {!session && (
          <>
            <span className={styles.notSignedInText}>
              You are not signed in
            </span>
            <SignIn className={styles.buttonPrimary}>Sign in</SignIn>
          </>
        )}
        {session && (
          <>
            {session.token.picture && (
              <img src={session.token.picture} className={styles.avatar} />
            )}
            <span className={styles.signedInText}>
              <small>Signed in as</small>
              <br />
              <strong>{session.token.email} </strong>
              {session.token.name ? `(${session.token.name})` : null}
            </span>
            <SignOut className={styles.button}>Sign out</SignOut>
          </>
        )}
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/dashboard">Dashboard (app)</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/policy">Policy (pages)</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
