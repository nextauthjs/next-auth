import { CallbacksOptions } from "../.."

export const defaultCallbacks: CallbacksOptions = {
  signIn() {
    return true
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return new URL(url, baseUrl).toString()
    else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  },
  session({ session }) {
    return session
  },
  jwt({ token }) {
    return token
  },
}
