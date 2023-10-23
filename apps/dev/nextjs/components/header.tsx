import type { Session } from "next-auth"
import Link from "next/link"
import styles from "./header.module.css"

export function Header({
  session,
  signIn,
  signOut,
}: {
  session: Session | null
  signIn: any
  signOut: any
}) {
  return (
    <header>
      <div className={styles.signedInStatus}>
        {!session?.user && (
          <>
            <span className={styles.notSignedInText}>
              You are not signed in
            </span>
            {signIn}
          </>
        )}
        {session?.user && (
          <>
            {session.user?.image && (
              <img src={session.user.image} className={styles.avatar} />
            )}
            <span className={styles.signedInText}>
              <small>Signed in as</small>
              <br />
              <strong>{session.user?.email} </strong>
              {session.user?.name ? `(${session.user.name})` : null}
            </span>
            {signOut}
          </>
        )}
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">Home (app)</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/dashboard">Dashboard (app)</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/policy">Policy (pages)</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/credentials">Credentials (pages)</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/protected-ssr">getServerSideProps (pages)</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/api/examples/protected">API Route (pages)</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
