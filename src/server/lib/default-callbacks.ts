import { CallbacksOptions } from "src/types/index"

export const defaultCallbacks: CallbacksOptions = {
  signIn() {
    return true
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith(baseUrl)) return url
    return baseUrl
  },
  session({ session }) {
    return session
  },
  jwt({ token }) {
    return token
  },
}
