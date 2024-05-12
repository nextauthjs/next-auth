import type { FastifyRequest, FastifyReply } from "fastify"

/**
 * Encodes an object as url-encoded string.
 */
export function encodeUrlEncoded(object: Record<string, any> = {}) {
  const params = new URLSearchParams()

  for (let [key, value] of Object.entries(object)) {
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
 * Encodes an Fastify Request body based on the content type header.
 */
function encodeRequestBody(req: FastifyRequest): string | undefined {
  const contentType = req.headers["content-type"]
  if (typeof req.body === "object" && req.body !== null) {
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      return encodeUrlEncoded(req.body)
    }

    if (contentType?.includes("application/json")) {
      return encodeJson(req.body)
    }
  }

  if (typeof req.body === "string") {
    return req.body
  }

  return undefined
}

/**
 * Adapts an Fastify Request to a Web Request, returning the Web Request.
 */
export function toWebRequest(req: FastifyRequest) {
  const url = req.protocol + "://" + req.hostname + req.originalUrl

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
 * Adapts a Web Response to an Fastify Response, invoking appropriate
 * Fastify response methods to handle the response.
 */
export async function toFastifyReply(response: Response, reply: FastifyReply) {
  response.headers.forEach((value, key) => {
    if (value) {
      reply.header(key, value)
    }
  })

  reply.status(response.status)

  return await response.text()
}
