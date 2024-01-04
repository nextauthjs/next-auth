import { webcrypto } from "crypto"

// @ts-expect-error
globalThis.crypto ??= webcrypto
