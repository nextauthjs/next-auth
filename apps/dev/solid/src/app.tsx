// @refresh reload
import { Header } from "./components/nav"
import "./app.css"

export default function App() {
  const session = {}
  return (
    <main>
      <Header session={session} />
      <h1>Hello world!</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  )
}
