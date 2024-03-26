import { Header } from "../components/nav"
import { getRequestEvent } from "solid-js/web"

export default function App() {
  const event = getRequestEvent()
  return (
    <main>
      <Header session={event?.locals?.auth} />
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
          <pre>{JSON.stringify(event?.locals?.auth ?? {}, null, 2)}</pre>
        </div>
      </section>
    </main>
  )
}
