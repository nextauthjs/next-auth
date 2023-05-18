import { auth } from "auth"
import Footer from "components/footer"
import { Header } from "components/header"
import { cookies } from "next/headers"
import styles from "components/header.module.css"
import "./styles.css"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        {/* @ts-expect-error */}
        <AppHeader />
        <main>{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}

function SignIn({ id, ...props }: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  const action = id ? `/auth/signin/${id}` : "/auth/signin"
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

export async function AppHeader() {
  const session = await auth()
  return (
    <Header
      session={session}
      signIn={<SignIn className={styles.buttonPrimary}>Sign in</SignIn>}
      signOut={<SignOut className={styles.button}>Sign out</SignOut>}
    />
  )
}
