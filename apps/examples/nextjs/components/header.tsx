import Link from "next/link"
import { auth } from "auth"
import { cookies, headers } from "next/headers"
import styles from "./header.module.css"

function SignIn({ id, children, className }: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  return (
    <form action={`/api/auth/signin/${id}`} method="post">
      <button className={className} type="submit">{children}</button>
      <input type="hidden" name="csrfToken" value={csrfToken} />
    </form>
  )
}

function SignOut({ children, className }: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  return (
    <form action="/api/auth/signout" method="post">
      <button className={className} type="submit">{children}</button>
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
      <noscript>
        <style>{".nojs-show { opacity: 1; top: 0; }"}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p className={`nojs-show ${styles.loaded}`}>
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <SignIn className={styles.buttonPrimary}>Sign In</SignIn>
            </>
          )}
          {session && (
            <>
              {session.user.image && (
                <img src={session.user.image} className={styles.avatar} />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email} </strong>
                {session.user.name ? `(${session.user.name})` : null}
              </span>
              <SignOut className={styles.button}>Sign Out</SignOut>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/client">Client</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/server-component">Server</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/protected">Protected</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/api-example">API</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/middleware-protected">Middleware protected</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export const runtime = "experimental-edge"
