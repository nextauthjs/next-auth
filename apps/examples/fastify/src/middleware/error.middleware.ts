//// @ts-nocheck
import { HttpError, NotFoundError } from "../errors.js"
import { FastifyReply, FastifyRequest } from "fastify"

export const errorHandler = (
  err: HttpError | Error,
  _req: FastifyRequest,
  _reply: FastifyReply,
): void => {
  const statusCode = (err instanceof HttpError && err.status) || 500
  _reply.status(statusCode).view("error", {
    title: err instanceof HttpError ? err.status : err.name,
    message: err.message,
  })
}

export const errorNotFoundHandler = (
  _req: FastifyRequest,
  _reply: FastifyReply,
): void => {
  new NotFoundError("Not Found")
}
