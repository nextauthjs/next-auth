import { Request as ExpressRequest, Response as ExpressResponse } from "express"

/**
 * Encodes an object as url-encoded string.
 */
export function encodeUrlEncoded(object: Record<string, any> = {}) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(object)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }
  }

  return params.toString()
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
    return encodeUrlEncoded(req.body)
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
      value.forEach((v) => v && headers.append(key, v))
      return
    }

    if (value) {
      headers.append(key, value)
    }
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
      res.append(key, value)
    }
  })

  // Explicitly write the headers for content-type
  // https://stackoverflow.com/a/59449326/13944042
  res.writeHead(response.status, response.statusText, {
    "Content-Type": response.headers.get("content-type") || "",
  })

  res.write(await response.text())
  res.end()
}
