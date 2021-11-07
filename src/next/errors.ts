import { UnknownError } from "../core/errors"

export class MissingRouteError extends UnknownError {
  name = "MissingRouteError"
  code = "MISSING_ROUTE"
}

export class MissingSecretError extends UnknownError {
  name = "MissingSecretError"
  code = "MISSING_SECRET"
}
