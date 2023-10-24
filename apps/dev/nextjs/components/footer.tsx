import Link from "next/link"
import styles from "./footer.module.css"
import packageJSON from "next-auth/package.json"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="https://authjs.dev">Documentation</a>
        </li>
        <li className={styles.navItem}>
          <a href="https://www.npmjs.com/package/next-auth">NPM</a>
        </li>
        <li className={styles.navItem}>
          <a href="https://github.com/nextauthjs/next-auth-example">GitHub</a>
        </li>
        <li className={styles.navItem}>
          <Link href="/policy">Policy</Link>
        </li>
        <li className={styles.navItem}>
          <em>{packageJSON.version}</em>
        </li>
      </ul>
    </footer>
  )
}
