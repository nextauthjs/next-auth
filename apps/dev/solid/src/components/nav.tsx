import { A } from "@solidjs/router"
import { signIn, signOut } from "@auth/solid-start/client"
import type { Session } from "@auth/solid-start"

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
            <button class="button-primary" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        ) : (
          <div class="nav-right">
            <span>You are not signed in</span>
            <button class="button-primary" onClick={() => signIn()}>
              Sign in
            </button>
          </div>
        )}
      </div>
      <div class="nav-links">
        <A href="/" activeClass="active">
          Home (app)
        </A>
        <A href="/dashboard" activeClass="active">
          Dashboard (app)
        </A>
        <A href="/policy" activeClass="active">
          Policy (pages)
        </A>
        <A href="/credentials" activeClass="active">
          Credentials (pages)
        </A>
        <A href="/protected-ssr" activeClass="active">
          getServerSideProps (pages)
        </A>
        <A href="/api/examples/protected" activeClass="active">
          API Route (pages)
        </A>
      </div>
    </nav>
  )
}
