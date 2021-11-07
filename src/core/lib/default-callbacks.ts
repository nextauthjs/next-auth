import { CallbacksOptions } from "../.."

export const defaultCallbacks: CallbacksOptions = {
  signIn() {
    return true
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith(baseUrl)) return url
    else if (url.startsWith("/")) return new URL(url, baseUrl).toString()
    return baseUrl
  },
  session({ session }) {
    return session
  },
  jwt({ token }) {
    return token
  },
}
