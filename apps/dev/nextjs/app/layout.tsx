import { auth, signIn, signOut, unstable_update as update } from "auth"
import Footer from "components/footer"
import { Header } from "components/header"
import styles from "components/header.module.css"
import "./styles.css"
import { AuthError } from "next-auth"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppHeader />
        <main>{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}

export async function AppHeader() {
  const session = await auth()
  return (
    <Header
      session={session}
      signIn={
        <form
          action={async () => {
            "use server"
            try {
              await signIn()
            } catch (error) {
              if (error instanceof AuthError) {
                console.log(error)
              }
              throw error
            }
          }}
        >
          <button className={styles.buttonPrimary}>Sign in</button>
        </form>
      }
      signOut={
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button className={styles.buttonPrimary}>Sign out</button>
        </form>
      }
    />
  )
}
