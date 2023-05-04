import Header from "./header"
import Footer from "./footer"
import "./styles.css"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <Header />
        <main>{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}
