import { createHash } from "node:crypto"
import { IncomingMessage, ServerResponse } from "node:http"
import { Socket } from "node:net"
import type { AuthOptions, LoggerInstance } from "../src"
import type { Adapter } from "../src/adapters"
import { AuthHandler } from "../src/core"

import NextAuth from "../src/next"

import type { NextApiRequest, NextApiResponse } from "next"
import { Stream } from "node:stream"

export function mockLogger(): Record<keyof LoggerInstance, jest.Mock> {
  return {
    error: jest.fn(() => {}),
    warn: jest.fn(() => {}),
    debug: jest.fn(() => {}),
  }
}

interface HandlerOptions {
  prod?: boolean
  path?: string
  params?: URLSearchParams | Record<string, string>
  requestInit?: RequestInit
}

export async function handler(
  options: AuthOptions,
  { prod, path, params, requestInit }: HandlerOptions
) {
  // @ts-expect-error
  if (prod) process.env.NODE_ENV = "production"

  const url = new URL(
    `http://localhost:3000/api/auth/${path ?? "signin"}?${new URLSearchParams(
      params ?? {}
    )}`
  )
  const req = new Request(url, { headers: { host: "" }, ...requestInit })
  const logger = mockLogger()
  const response = await AuthHandler(req, {
    secret: "secret",
    ...options,
    logger,
  })
  // @ts-expect-error
  if (prod) process.env.NODE_ENV = "test"

  return {
    res: {
      status: response.status,
      headers: response.headers,
      body: response.body,
      redirect: response.headers.get("location"),
      html:
        response.headers?.get("content-type") === "text/html"
          ? await response.clone().text()
          : undefined,
    },
    log: logger,
  }
}

export function createCSRF() {
  const secret = "secret"
  const value = "csrf"
  const token = createHash("sha256").update(`${value}${secret}`).digest("hex")

  return {
    secret,
    csrf: { value, token, cookie: `next-auth.csrf-token=${value}|${token}` },
  }
}

export function mockAdapter(): Adapter {
  const adapter: Adapter = {
    createVerificationToken: jest.fn(() => {}),
    useVerificationToken: jest.fn(() => {}),
    getUserByEmail: jest.fn(() => {}),
  } as unknown as Adapter
  return adapter
}

export async function nextHandler(
  params: {
    req?: Partial<NextApiRequest>
    res?: Partial<NextApiResponse>
    options?: Partial<AuthOptions>
  } = {}
) {
  let req = params.req
  // @ts-expect-error
  let res: NextApiResponse = params.res
  if (!params.res) {
    ;({ req, res } = mockReqRes(params.req))
  }

  const logger = mockLogger()
  // @ts-expect-error
  await NextAuth(req, res, {
    providers: [],
    secret: "secret",
    logger,
    ...params.options,
  })

  return { req, res, logger }
}

export function mockReqRes(req?: Partial<NextApiRequest>): {
  req: NextApiRequest
  res: NextApiResponse
} {
  const request = new IncomingMessage(new Socket())
  request.headers = req?.headers ?? {}
  request.method = req?.method
  request.url = req?.url

  const response = new ServerResponse(request)
  // @ts-expect-error
  response.status = (code) => (response.statusCode = code)
  // @ts-expect-error
  response.send = (data) => sendData(request, response, data)
  // @ts-expect-error
  response.json = (data) => sendJson(response, data)

  const res: NextApiResponse = {
    ...response,
    // @ts-expect-error
    setHeader: jest.spyOn(response, "setHeader"),
    // @ts-expect-error
    getHeader: jest.spyOn(response, "getHeader"),
    // @ts-expect-error
    removeHeader: jest.spyOn(response, "removeHeader"),
    // @ts-expect-error
    status: jest.spyOn(response, "status"),
    // @ts-expect-error
    send: jest.spyOn(response, "send"),
    // @ts-expect-error
    json: jest.spyOn(response, "json"),
    // @ts-expect-error
    end: jest.spyOn(response, "end"),
    // @ts-expect-error
    getHeaders: jest.spyOn(response, "getHeaders"),
  }

  return { req: request as any, res }
}

// Code below is copied from Next.js
// https://github.com/vercel/next.js/tree/canary/packages/next/server/api-utils
// TODO: Remove

/**
 * Send `any` body to response
 * @param req request object
 * @param res response object
 * @param body of response
 */
function sendData(req: NextApiRequest, res: NextApiResponse, body: any): void {
  if (body === null || body === undefined) {
    res.end()
    return
  }

  // strip irrelevant headers/body
  if (res.statusCode === 204 || res.statusCode === 304) {
    res.removeHeader("Content-Type")
    res.removeHeader("Content-Length")
    res.removeHeader("Transfer-Encoding")

    if (process.env.NODE_ENV === "development" && body) {
      console.warn(
        `A body was attempted to be set with a 204 statusCode for ${req.url}, this is invalid and the body was ignored.\n` +
          `See more info here https://nextjs.org/docs/messages/invalid-api-status-body`
      )
    }
    res.end()
    return
  }

  const contentType = res.getHeader("Content-Type")

  if (body instanceof Stream) {
    if (!contentType) {
      res.setHeader("Content-Type", "application/octet-stream")
    }
    body.pipe(res)
    return
  }

  const isJSONLike = ["object", "number", "boolean"].includes(typeof body)
  const stringifiedBody = isJSONLike ? JSON.stringify(body) : body

  if (Buffer.isBuffer(body)) {
    if (!contentType) {
      res.setHeader("Content-Type", "application/octet-stream")
    }
    res.setHeader("Content-Length", body.length)
    res.end(body)
    return
  }

  if (isJSONLike) {
    res.setHeader("Content-Type", "application/json; charset=utf-8")
  }

  res.setHeader("Content-Length", Buffer.byteLength(stringifiedBody))
  res.end(stringifiedBody)
}

/**
 * Send `JSON` object
 * @param res response object
 * @param jsonBody of data
 */
function sendJson(res: NextApiResponse, jsonBody: any): void {
  // Set header to application/json
  res.setHeader("Content-Type", "application/json; charset=utf-8")

  // Use send to handle request
  res.send(JSON.stringify(jsonBody))
}
