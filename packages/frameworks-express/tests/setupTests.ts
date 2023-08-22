import cryptoLib from "crypto"

function setup() {
  if (!globalThis.fetch) {
    import("node-fetch").then((module) => {
      // @ts-expect-error
      globalThis.fetch = module.default
      // @ts-expect-error
      globalThis.Request = module.Request
      // @ts-expect-error
      globalThis.Response = module.Response
      // @ts-expect-error
      globalThis.Headers = module.Headers
    })
  }

  if (!globalThis.crypto) {
    // @ts-expect-error
    globalThis.crypto = cryptoLib.webcrypto
  }
}

setup()
