import { SessionProvider, useSession } from "next-auth/react"
import "./styles.css"
import { Header } from "components/header"
import styles from "components/header.module.css"
import Footer from "components/footer"

export default function App({ Component, pageProps }) {
  return (
    <>
      <SessionProvider basePath="/auth">
        <PagesHeader />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
      <SessionProvider  basePath="/auth-2">
        <PagesHeader />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  )
}

function PagesHeader() {
  const { signIn, config, signOut, data: session } = useSession()
  return (
    <Header
      sessions={[{
        session,
        signIn: (<button onClick={() => signIn({ config })} className={styles.buttonPrimary}>
          Sign in
        </button>),
        signOut: (<button onClick={() => signOut({ config })} className={styles.buttonPrimary}>
        Sign out
      </button>),
      }]}
      sign={(func) => () => func()}
      
    />
  )
}
