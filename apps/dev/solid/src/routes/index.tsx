// @refresh reload
import { Header } from "../components/nav"

export default function App(event) {
  console.log("app.event", event)
  const session = event?.locals?.auth() ?? {}
  return (
    <main>
      <Header session={session} />
      <h1>Hello world!</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  )
}
