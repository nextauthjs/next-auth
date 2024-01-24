import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import "./styles.css"
import { Header } from "components/header"
import styles from "components/header.module.css"
import Footer from "components/footer"

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} basePath="/auth">
      <PagesHeader />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  )
}

function PagesHeader() {
  const { data: session } = useSession()
  return (
    <Header
      session={session}
      signIn={
        <button onClick={() => signIn()} className={styles.buttonPrimary}>
          Sign in
        </button>
      }
      signOut={
        <button onClick={() => signOut()} className={styles.button}>
          Sign out
        </button>
      }
    />
  )
}
