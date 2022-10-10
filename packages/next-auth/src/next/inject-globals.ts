import * as crypto from "crypto"

declare global {
  interface Crypto {
    createHash?: typeof crypto.createHash
    randomBytes?: typeof crypto.randomBytes
    // @ts-expect-error
    subtle?: SubtleCrypto
    // @ts-expect-error
    getRandomValues?: <
      T extends
        | Int8Array
        | Int16Array
        | Int32Array
        | Uint8Array
        | Uint16Array
        | Uint32Array
        | Uint8ClampedArray
        | Float32Array
        | Float64Array
        | DataView
        | null
    >(
      array: T
    ) => T
  }
}

if (!globalThis.crypto) globalThis.crypto = crypto
