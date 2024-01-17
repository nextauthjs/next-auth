export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, status = 404) {
    super(status, message)
    this.name = "NotFoundError"
  }
}
