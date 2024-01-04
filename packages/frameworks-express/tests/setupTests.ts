import { fetch, Headers, Request, Response } from "undici"
import { webcrypto } from "crypto"

// @ts-expect-error
globalThis.fetch ??= fetch

// @ts-expect-error
globalThis.Headers ??= Headers

// @ts-expect-error
globalThis.Request ??= Request

// @ts-expect-error
globalThis.Response ??= Response

// @ts-expect-error
globalThis.crypto ??= webcrypto
