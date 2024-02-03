import "./globals.css"
import Head from "next/head"
import { Inter } from "next/font/google"
import Footer from "@/components/footer"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <Head>
        <title>"NextAuth.js Example"</title>
      </Head>
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <main className="flex-auto py-4 px-4 mx-auto w-full max-w-3xl sm:px-6 md:py-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
