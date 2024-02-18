import { Header } from "../components/nav"
import type { RouteSectionProps } from "@solidjs/router"

const getSession = async (event) => {
  "use server"
  console.log("getSEssion.event", event)
  const session = await event?.locals?.auth()
  return session
}

export default function App(props: RouteSectionProps) {
  const sesh = typeof window !== "undefined" ? window.__locals : {}
  console.log("\nAPP.PROPS", sesh)
  // const session = event?.locals?.auth() ?? {}
  const session = getSession()
  return (
    <main>
      <Header session={session} />
      <section class="main">
        <h1>Solid Start Auth Example</h1>
        <p>
          This is an example site to demonstrate how to use{" "}
          <a href="https://start.solidjs.com">Solid Start</a> with{" "}
          <a href="https://solidstart.authjs.dev">Solid Start Auth</a> for
          authentication. The "Sign-in" button in the navigation bar is using
          the client-side methods and will take you to the built-in sign-in page
          with all provider options.
        </p>
        <div class="session">
          <h3>Session</h3>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      </section>
    </main>
  )
}
