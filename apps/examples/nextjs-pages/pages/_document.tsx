import { Html, Head, Main, NextScript } from "next/document"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Header />
        <div className="flex-auto py-4 px-4 mx-auto w-full max-w-3xl sm:px-6 md:py-6">
          <Main />
        </div>
        <Footer />
        <NextScript />
      </body>
    </Html>
  )
}
