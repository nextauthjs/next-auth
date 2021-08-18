import { IncomingMessage, ServerResponse } from "http"

export type Awaitable<T> = T | PromiseLike<T>

// ------------------------------------------------------
// Types from next@10,
// see: https://github.com/microsoft/dtslint/issues/297
// ------------------------------------------------------
export interface NextApiRequest extends IncomingMessage {
  query: {
    [key: string]: string | string[]
  }
  cookies: {
    [key: string]: string
  }
  body: any
  env: any
  preview?: boolean
  previewData?: any
}

export type Send<T> = (body: T) => void

export type NextApiResponse<T = any> = ServerResponse & {
  send: Send<T>
  json: Send<T>
  status: (statusCode: number) => NextApiResponse<T>
  redirect: ((url: string) => NextApiResponse<T>) &
    ((status: number, url: string) => NextApiResponse<T>)
  setPreviewData: (
    data: object | string,
    options?: {
      maxAge?: number
    }
  ) => NextApiResponse<T>
  clearPreviewData: () => NextApiResponse<T>
}

export type NextApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | Promise<void>
