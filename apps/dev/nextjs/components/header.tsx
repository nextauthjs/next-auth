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
    <header className={styles.header}>
      <div className={styles.signedInStatus}>
        <img
          src={
            session?.user?.image ??
            `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`
          }
          className={styles.avatar}
        />
        {session?.user ? (
          <>
            <span className={styles.signedInText}>
              <small>Signed in as</small>
              <br />
              <strong>{session.user?.email} </strong>
              {session.user?.name ? `(${session.user.name})` : null}
            </span>
            {signOut}
          </>
        ) : (
          <>
            <span className={styles.notSignedInText}>
              You are not signed in
            </span>
            {signIn}
          </>
        )}
      </div>
      <nav>
        <ul className={styles.navItems}>
          <Link href="/" className={styles.navItem}>
            Home (app)
          </Link>
          <Link className={styles.navItem} href="/dashboard">
            Dashboard (app)
          </Link>
          <Link className={styles.navItem} href="/policy">
            Policy (pages)
          </Link>
          <Link className={styles.navItem} href="/credentials">
            Credentials (pages)
          </Link>
          <Link className={styles.navItem} href="/protected-ssr">
            getServerSideProps (pages)
          </Link>
          <Link className={styles.navItem} href="/api/examples/protected">
            API Route (pages)
          </Link>
        </ul>
      </nav>
    </header>
  )
}
