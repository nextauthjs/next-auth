import { auth, CSRF_experimental } from "auth"
import Footer from "components/footer"
import { Header } from "components/header"
import Link from "next/link"
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

async function SignIn({ id, ...props }: { id?: string } & any) {
  if (id) {
    return (
      <form action={`/auth/signin/${id}`} method="post">
        {/* @ts-expect-error */}
        <CSRF_experimental />
        <button {...props} />
      </form>
    )
  }
  return <Link href="/auth/signin" {...props} />
}

async function SignOut(props: JSX.IntrinsicElements["button"]) {
  return (
    <form action="/auth/signout" method="post">
      <button {...props} />
      {/* @ts-expect-error */}
      <CSRF_experimental />
    </form>
  )
}

export async function AppHeader() {
  const session = await auth()
  return (
    <Header
      session={session}
      signIn={
        // @ts-expect-error
        <SignIn id="github" className={styles.buttonPrimary}>
          Sign in
        </SignIn>
      }
      // @ts-expect-error
      signOut={<SignOut className={styles.button}>Sign out</SignOut>}
    />
  )
}
