import { StrictMode, ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import Header from './header'
import Footer from './footer'
import './layout.css'

export { PageLayout }

function PageLayout ({ children, session }: { children: ReactNode; session: Session | null }) {
  return (
    <StrictMode>
      <SessionProvider session={session}>
       <Header />
        <main>{children}</main>
        <Footer />
      </SessionProvider>
    </StrictMode>
  )
}
