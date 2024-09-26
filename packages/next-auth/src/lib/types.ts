// @ts-expect-error Next.js does not yet correctly use the `package.json#exports` field
import type { NextRequest } from "next/server"

/**
 * AppRouteHandlerFnContext is the context that is passed to the handler as the
 * second argument.
 */
export type AppRouteHandlerFnContext = {
  params?: Record<string, string | string[]>
}
/**
 * Handler function for app routes. If a non-Response value is returned, an error
 * will be thrown.
 */
export type AppRouteHandlerFn = (
  /**
   * Incoming request object.
   */
  req: NextRequest,
  /**
   * Context properties on the request (including the parameters if this was a
   * dynamic route).
   */
  ctx: AppRouteHandlerFnContext
) => void | Response | Promise<void | Response>

export type AppRouteHandlers = Record<
  "GET" | "POST",
  (req: NextRequest) => Promise<Response>
>
