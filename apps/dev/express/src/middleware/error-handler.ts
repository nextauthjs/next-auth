import { NextFunction, Request, Response } from "express"
import createError, { HttpError } from "http-errors"

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error", { title: err.name, message: err.message })
}

export const errorNotFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(createError(404))
}
