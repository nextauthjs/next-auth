import { SessionProvider } from "next-auth/react"
import "./styles.css"

// Use the <SessionProvider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider
      // SessionProvider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      // Client Max Age controls how often the useSession in the client should
      // contact the server to sync the session state. Value in seconds.
      // e.g.
      // * 0  - Disabled (always use cache value)
      // * 60 - Sync session state with server if it's older than 60 seconds
      staleTime={0}
      // Keep Alive tells windows / tabs that are signed in to keep sending
      // a keep alive request (which extends the current session expiry) to
      // prevent sessions in open windows from expiring. Value in seconds.
      //
      // Note: If a session has expired when keep alive is triggered, all open
      // windows / tabs will be updated to reflect the user is signed out.
      refetchInterval={0}
      session={session}
    >
      <Component {...pageProps} />
    </SessionProvider>
  )
}
