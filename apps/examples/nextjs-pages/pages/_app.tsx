import "./globals.css"
import { cn } from "@/lib/utils"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"

const inter = Inter({ subsets: ["latin"] })

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={cn("flex h-dvh flex-col", inter.className)}>
        <Header />
        <div className="flex-grow">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </SessionProvider>
  )
}
