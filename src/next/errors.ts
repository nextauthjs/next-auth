import { UnknownError } from "../core/errors"

export class NoAPIRouteError extends UnknownError {
  name = "NoAPIRouteError"
  code = "MISSING_NEXTAUTH_API_ROUTE_ERROR"
}

export class NoSecretError extends UnknownError {
  name = "NoSecretError"
  code = "NO_SECRET"
}
