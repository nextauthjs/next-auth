import { LoggerInstance } from "src/lib/logger"
import { CallbacksOptions } from "../.."

const defaultCallbacks: CallbacksOptions = {
  shouldSignIn() {
    return true
  },
  async redirect({ url, baseUrl }) {
    if (url.startsWith(baseUrl)) return url
    // If the url is not absolute, prepend with base URL
    return new URL(url, baseUrl).toString()
  },
  session({ session }) {
    return session
  },
  jwt({ token }) {
    return token
  },
}

export function mergeCallbacks(
  userCallbacks: Partial<CallbacksOptions> | undefined,
  logger: LoggerInstance
): CallbacksOptions {
  const callbacks = { ...defaultCallbacks, ...userCallbacks }
  if (userCallbacks?.signIn) {
    logger.warn("SIGNIN_CALLBACK_RENAMED")
    callbacks.shouldSignIn = userCallbacks?.signIn
  }

  return callbacks
}
