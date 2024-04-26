import Document, { Html, Head, Main, NextScript } from "next/document"
import { SkipNavLink } from "nextra-theme-docs"

class AuthDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <SkipNavLink styled />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AuthDocument
