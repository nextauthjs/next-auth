import type { RequestEvent } from "@sveltejs/kit"

const PROTECTED_ROUTE_IDENTIFIER = "(protected)"
const ADMIN_ROUTE_IDENTIFIER = "(admin)"

/**
 * Checks if the route is protected.
 * @param event - The request event.
 * @returns True if the route is protected, false otherwise.
 */
export const isProtectedRoute = (event: RequestEvent): boolean =>
  event.route.id?.includes(PROTECTED_ROUTE_IDENTIFIER) ?? false

/**
 * Checks if the route is an admin route.
 * @param event - The request event.
 * @returns True if the route is an admin route, false otherwise.
 */
export const isAdminRoute = (event: RequestEvent): boolean =>
  event.route.id?.includes(ADMIN_ROUTE_IDENTIFIER) ?? false
