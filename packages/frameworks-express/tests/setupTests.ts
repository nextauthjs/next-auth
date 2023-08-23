import { fetch, Headers } from "undici"
import { webcrypto } from "crypto"

// @ts-expect-error
globalThis.fetch ??= fetch

// @ts-expect-error
globalThis.fetch ??= Headers

// @ts-expect-error
globalThis.crypto ??= webcrypto
