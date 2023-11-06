import * as React from "react"
import { SessionProvider } from "@auth/nextjs/react"

export const wrapRootElement = ({ element }) => (
  <SessionProvider>{element}</SessionProvider>
)
