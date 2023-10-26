import { auth, signIn, signOut, update } from "auth"
import Footer from "components/footer"
import { Header } from "components/header"
import styles from "components/header.module.css"
import "./styles.css"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppHeader />
        <main>{props.children}</main>
        <div>
          <form
            action={async () => {
              "use server"
              update({ user: { name: "New Name" } })
            }}
          >
            <button>Update name</button>
          </form>
        </div>
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
            await signIn("github")
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
          <button className={styles.button}>Sign out</button>
        </form>
      }
    />
  )
}
