import { auth, signIn, signOut, unstable_update as update } from "auth"
import { auth as auth2, signIn as signIn2, signOut as signOut2, unstable_update as update2 } from "auth-2"
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
  const [session, session2] = await Promise.all([
    auth(),
    auth2(),
  ]);
  return (
    <>
      <Header
        sessions={[
          {
            session,
            signIn: (
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
            ),
            signOut: (
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button className={styles.buttonPrimary}>Sign out</button>
              </form>
            )
          },
          {
            session: session2,
            signIn: (
              <form
                action={async () => {
                  "use server"
                  try {
                    await signIn2()
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
            ),
            signOut: (
              <form
                action={async () => {
                  "use server"
                  await signOut2()
                }}
              >
                <button className={styles.buttonPrimary}>Sign out</button>
              </form>
            )
          }
        ]}
        sign={(func) => async () => {
          'use server';
          try {
            await func()
          } catch (error) {
            if (error instanceof AuthError) {
              console.log(error)
            }
            throw error
          }
        }}      
      />
    </>
  )
}
