import { SessionProvider } from "@auth/nextjs/client"
import "./styles.css"

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
