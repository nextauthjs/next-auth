import type { Session } from "@auth/solid-start"
// import { signIn, signOut } from "../../auth"
import { signIn, signOut } from "@auth/solid-start/client"

export function Header({ session }: { session: Session | null }) {
  return (
    <nav>
      <div class="wrapper">
        <img
          class="nav-left"
          src={
            session?.user?.image ?? "https://source.boringavatars.com/beam/120"
          }
        />
        {session?.user ? (
          <div class="nav-right">
            <span>
              <small>Signed in as</small>
              <br />
              <strong>{session.user?.email} </strong>
              {session.user?.name ? `(${session.user.name})` : null}
            </span>
            <button class="button-primary" onClick={signOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <div class="nav-right">
            <span>You are not signed in</span>
            <button class="button-primary" onClick={() => signIn("github")}>
              Sign in
            </button>
          </div>
        )}
      </div>
      <div class="nav-links">
        <a href="/">Home (app)</a>
        <a href="/dashboard">Dashboard (app)</a>
        <a href="/policy">Policy (pages)</a>
        <a href="/credentials">Credentials (pages)</a>
        <a href="/protected-ssr">getServerSideProps (pages)</a>
        <a href="/api/examples/protected">API Route (pages)</a>
      </div>
    </nav>
  )
}
