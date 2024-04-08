import * as React from "react"
import { SessionProvider } from "next-auth/react"

export const wrapRootElement = ({ element }) => (
  <SessionProvider>{element}</SessionProvider>
)
