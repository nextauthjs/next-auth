import { Request as ExpressRequest, Response as ExpressResponse } from "express"

/**
 * Encodes an object as url-encoded string.
 */
function encodeUrl(obj: Record<string, any>) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const encKey = encodeURIComponent(key)
    const encValue = encodeURIComponent(value)
    return `${acc ? `${acc}&` : ""}${encKey}=${encValue}`
  }, "")
}

/**
 * Encodes an object as JSON
 */
function encodeJson(obj: Record<string, any>) {
  return JSON.stringify(obj)
}

/**
 * Encodes an Express Request body based on the content type header.
 */
function encodeRequestBody(req: ExpressRequest) {
  const contentType = req.headers["content-type"]

  if (contentType?.includes("application/x-www-form-urlencoded")) {
    return encodeUrl(req.body)
  }

  if (contentType?.includes("application/json")) {
    return encodeJson(req.body)
  }

  return req.body
}

/**
 * Adapts an Express Request to a Web Request, returning the Web Request.
 */
export function toWebRequest(req: ExpressRequest) {
  const url = req.protocol + "://" + req.get("host") + req.originalUrl

  const headers = new Headers()

  Object.entries(req.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        v && headers.append(key, v)
      })
      return
    }

    value && headers.append(key, value)
  })

  // GET and HEAD not allowed to receive body
  const body = /GET|HEAD/.test(req.method) ? undefined : encodeRequestBody(req)

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  })

  return request
}

/**
 * Adapts a Web Response to an Express Response, invoking appropriate
 * Express response methods to handle the response.
 */
export async function toExpressResponse(
  response: Response,
  res: ExpressResponse
) {
  response.headers.forEach((value, key) => {
    if (value) {
      res.appendHeader(key, value)
    }
  })

  res.status(response.status)
  res.write(await response.text())
  res.end()
}
