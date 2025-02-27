import { describe, expect, it, vi, test, afterEach } from "vitest"
import {
  GenerateAuthenticationOptionsOpts,
  GenerateRegistrationOptionsOpts,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import type {
  Adapter,
  AdapterAccount,
  AdapterUser,
  AdapterAuthenticator,
} from "../src/adapters"
import WebAuthn, {
  GetUserInfo,
  WebAuthnConfig,
  WebAuthnProviderType,
} from "../src/providers/webauthn"
import {
  WebAuthnAction,
  assertInternalOptionsWebAuthn,
  getAuthenticationResponse,
  getRegistrationResponse,
  inferWebAuthnOptions,
  verifyAuthenticate,
  verifyRegister,
  fromBase64,
  toBase64,
  stringToTransports,
  transportsToString,
} from "../src/lib/utils/webauthn-utils"
import { webauthnChallenge } from "../src/lib/actions/callback/oauth/checks"
import {
  InternalOptions,
  InternalProvider,
  RequestInternal,
} from "../src/types"
import {
  AdapterError,
  AuthError,
  InvalidProvider,
  MissingAdapter,
  WebAuthnVerificationError,
} from "../src/errors"
import { randomString } from "../src/lib/utils/web"
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/server/script/deps"
import { Cookie } from "../src/lib/utils/cookie"
import { randomInt } from "crypto"

const getMockAdapter = () =>
  ({
    getAuthenticator: vi.fn(),
    updateAuthenticatorCounter: vi.fn(),
    getAccount: vi.fn(),
    listAuthenticatorsByUserId: vi.fn(),
    getUser: vi.fn(),
  }) as unknown as Required<Adapter>

function getMockOptions(
  defaultOptions?: Partial<InternalOptions>,
  defaultProvider?: Partial<WebAuthnConfig>
) {
  const {
    adapter = getMockAdapter(),
    provider = WebAuthn(defaultProvider ?? {}),
    experimental = { enableWebAuthn: true },
    action = "webauthn-options",
    logger = { error: vi.fn() },
    url = new URL("http://myapp.com:3000"),
    ...rest
  } = defaultOptions ?? {}

  rest.providers ??= [provider as InternalProvider]

  return {
    adapter,
    provider,
    experimental,
    url,
    logger,
    action,
    ...rest,
  } as InternalOptions<WebAuthnProviderType> & { adapter: Required<Adapter> }
}

function createAuthenticator(
  partial?: Partial<AdapterAuthenticator>
): AdapterAuthenticator {
  const id = randomString(32)
  return {
    userId: randomString(32),
    credentialID: id,
    providerAccountId: id,
    counter: 0,
    credentialBackedUp: false,
    credentialDeviceType: "platform",
    credentialPublicKey: randomString(32),
    transports: "usb,ble,nfc",
    ...partial,
  }
}

function getExpectedResponse(
  action: WebAuthnAction,
  options: unknown,
  cookies: Cookie[] = []
) {
  const cookie = {
    name: "test",
    value: "test",
    options: {},
  }
  vi.mocked(webauthnChallenge.create).mockResolvedValue({ cookie })
  return {
    status: 200,
    cookies: [...cookies, cookie],
    body: {
      action,
      options,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }
}

/**
 * Generates default params for verifyAuthenticate and verifyRegister tests
 */
function prepareVerifyTest(
  action: WebAuthnAction,
  requestData?: Record<string, unknown>
) {
  const options = getMockOptions()
  const credentialID = toBase64(new Uint8Array([1, 2, 3, 4, 5]))
  requestData ??= {
    key: "value",
    id: credentialID,
    response: { transports: ["ble", "nfc"] },
  }
  const request = {
    body: { data: JSON.stringify(requestData) },
    cookies: "reqcookies",
  } as unknown as RequestInternal
  const cookies = [{ name: "other", value: "value", options: {} }]

  const authenticator = createAuthenticator({
    credentialID,
    providerAccountId: credentialID,
    // @ts-expect-error
    transports: requestData.response?.transports
      ? transportsToString(requestData.response?.transports)
      : "usb,ble,nfc",
  })
  vi.mocked(options.adapter.getAuthenticator).mockResolvedValue(authenticator)

  const challenge = "mychallenge"
  vi.mocked(webauthnChallenge.use).mockResolvedValue({ challenge })

  const newCounter = authenticator.counter + randomInt(100)
  if (action === "authenticate") {
    vi.mocked(verifyAuthenticationResponse).mockResolvedValue({
      verified: true,
      // @ts-expect-error
      authenticationInfo: {
        newCounter,
      },
    })
  } else {
    vi.mocked(verifyRegistrationResponse).mockResolvedValue({
      verified: true,
      registrationInfo: {
        counter: authenticator.counter,
        credentialID: authenticator.credentialID,
        credentialPublicKey: fromBase64(authenticator.credentialPublicKey),
        credentialBackedUp: authenticator.credentialBackedUp,
        // @ts-expect-error
        credentialDeviceType: authenticator.credentialDeviceType,
      },
    })
  }

  const account = {
    providerAccountId: authenticator.providerAccountId,
    userId: authenticator.userId,
    type: options.provider.type,
    provider: options.provider.id,
  } as unknown as AdapterAccount
  vi.mocked(options.adapter.getAccount).mockResolvedValue(account)

  const user = {
    id: authenticator.userId,
    email: "user@example.com",
  } as unknown as AdapterUser
  vi.mocked(options.adapter.getUser).mockResolvedValue(user)

  const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
  const expectedAuthenticationResponse = {
    ...defaultWebAuthnConfig.verifyAuthenticationOptions,
    expectedChallenge: challenge,
    response: requestData,
    authenticator: {
      ...authenticator,
      credentialID: fromBase64(authenticator.credentialID),
      transports: stringToTransports(authenticator.transports),
      credentialPublicKey: fromBase64(authenticator.credentialPublicKey),
    },
    expectedOrigin: rp.origin,
    expectedRPID: rp.id,
  }

  const expectedRegistrationResponse = {
    ...defaultWebAuthnConfig.verifyRegistrationOptions,
    expectedChallenge: challenge,
    response: requestData,
    expectedOrigin: rp.origin,
    expectedRPID: rp.id,
  }

  return {
    user,
    account,
    options,
    request,
    cookies,
    newCounter,
    credentialID,
    authenticator,
    expectedRegistrationResponse,
    expectedAuthenticationResponse,
  }
}

vi.mock("@simplewebauthn/server", () => ({
  generateAuthenticationOptions: vi.fn(),
  generateRegistrationOptions: vi.fn(),
  verifyAuthenticationResponse: vi.fn(),
  verifyRegistrationResponse: vi.fn(),
}))

vi.mock("../src/lib/actions/callback/oauth/checks", () => ({
  webauthnChallenge: {
    create: vi.fn(),
    use: vi.fn(),
  },
}))

const defaultWebAuthnConfig = WebAuthn({})

afterEach(() => {
  vi.resetAllMocks()
})

describe("assertInternalOptionsWebAuthn", () => {
  it("accepts valid options", () => {
    const options = getMockOptions()
    expect(assertInternalOptionsWebAuthn(options)).toEqual(options)
  })
  it("errors on missing adapter", () => {
    const options = getMockOptions()
    options.adapter = undefined as unknown as Required<Adapter>
    expect(() => assertInternalOptionsWebAuthn(options)).toThrow(MissingAdapter)
  })
  it("errors on non-webauthn provider", () => {
    const options = getMockOptions()
    options.provider.type = "email" as unknown as WebAuthnProviderType
    expect(() => assertInternalOptionsWebAuthn(options)).toThrow(
      InvalidProvider
    )
  })
})

describe("fromBase64", () => {
  it("decodes base64", () => {
    expect(fromBase64("AQIDBAU=")).toEqual(new Uint8Array([1, 2, 3, 4, 5]))
  })

  it("is stable", () => {
    const input = new Uint8Array([1, 2, 3, 4, 5])
    expect(fromBase64(toBase64(input))).toEqual(input)
  })
})

describe("toBase64", () => {
  it("encodes base64", () => {
    expect(toBase64(new Uint8Array([1, 2, 3, 4, 5]))).toEqual("AQIDBAU=")
  })

  it("is stable", () => {
    const input = "AQIDBAU="
    expect(toBase64(fromBase64(input))).toEqual(input)
  })
})

describe("stringToTransports", () => {
  it("converts string to transports", () => {
    expect(stringToTransports("usb,ble,nfc")).toEqual(["usb", "ble", "nfc"])
  })

  it("handles empty string", () => {
    expect(stringToTransports("")).toEqual(undefined)
  })

  it("accepts undefined", () => {
    expect(stringToTransports(undefined)).toEqual(undefined)
  })
})

describe("transportsToString", () => {
  it("converts transports to string", () => {
    expect(transportsToString(["usb", "ble", "nfc"])).toEqual("usb,ble,nfc")
  })

  it("handles empty array", () => {
    expect(transportsToString([])).toEqual("")
  })

  it("accepts undefined", () => {
    expect(transportsToString(undefined)).toEqual(undefined)
  })
})

describe("getRelayingParty", () => {
  it("returns relaying party with default values", () => {
    const options = getMockOptions()
    const relayingParty = options.provider.getRelayingParty(
      options,
      {} as RequestInternal
    )

    expect(relayingParty).toEqual({
      id: options.url.hostname,
      name: options.url.host,
      origin: options.url.origin,
    })
  })

  it("returns relaying party with custom values", () => {
    const options = getMockOptions(
      {},
      {
        relayingParty: {
          id: "my-id",
          name: "My Relaying Party",
          origin: "https://custom.com",
        },
      }
    )
    const relayingParty = options.provider.getRelayingParty(
      options,
      {} as RequestInternal
    )

    expect(relayingParty).toEqual({
      id: "my-id",
      name: "My Relaying Party",
      origin: "https://custom.com",
    })
  })

  it("returns relaying party with mixed values", () => {
    const options = getMockOptions(
      {},
      {
        relayingParty: {
          id: "my-id",
          origin: "https://custom.com",
        },
      }
    )
    const relayingParty = options.provider.getRelayingParty(
      options,
      {} as RequestInternal
    )

    expect(relayingParty).toEqual({
      id: "my-id",
      name: options.url.host,
      origin: "https://custom.com",
    })
  })

  it("uses the first value if array by default", () => {
    const options = getMockOptions(
      {},
      {
        relayingParty: {
          id: ["other-id", "my-id"],
          name: ["Other Relaying Party", "My Relaying Party"],
          origin: ["https://other.com", "https://custom.com"],
        },
      }
    )
    const relayingParty = options.provider.getRelayingParty(
      options,
      {} as RequestInternal
    )

    expect(relayingParty).toEqual({
      id: "other-id",
      name: "Other Relaying Party",
      origin: "https://other.com",
    })
  })

  it("accepts custom getRelayingParty function", () => {
    const options = getMockOptions(
      {},
      {
        relayingParty: {
          id: "my-id",
          origin: "https://custom.com",
        },
        getRelayingParty: (opts, req) => {
          const id = opts.provider.relayingParty!.id as string
          return {
            id,
            name: req.url.host,
            origin: req.url.origin,
          }
        },
      }
    )
    const relayingParty = options.provider.getRelayingParty(options, {
      url: new URL("https://myapp.com"),
    } as RequestInternal)

    expect(relayingParty).toEqual({
      id: "my-id",
      name: "myapp.com",
      origin: "https://myapp.com",
    })
  })
})

describe("inferWebAuthnOptions", () => {
  const cases: {
    action?: WebAuthnAction
    loggedIn: boolean
    userInfo: Awaited<ReturnType<GetUserInfo>>
    expected: WebAuthnAction | null
  }[] = [
    {
      action: "authenticate",
      loggedIn: true,
      userInfo: { user: {}, exists: true },
      expected: "authenticate",
    },
    {
      action: "authenticate",
      loggedIn: false,
      userInfo: { user: {}, exists: true },
      expected: "authenticate",
    },
    {
      action: "authenticate",
      loggedIn: false,
      userInfo: null,
      expected: "authenticate",
    },
    {
      action: "register",
      loggedIn: false,
      userInfo: { user: {}, exists: false },
      expected: "register",
    },
    {
      action: "register",
      loggedIn: true,
      userInfo: { user: {}, exists: true },
      expected: "register",
    },
    {
      action: "register",
      loggedIn: false,
      userInfo: null,
      expected: null,
    },
    {
      action: "register",
      loggedIn: false,
      userInfo: { user: {}, exists: true },
      expected: null,
    },
    {
      action: undefined,
      loggedIn: false,
      userInfo: { user: {}, exists: true },
      expected: "authenticate",
    },
    {
      action: undefined,
      loggedIn: false,
      userInfo: { user: {}, exists: false },
      expected: "register",
    },
    {
      action: undefined,
      loggedIn: false,
      userInfo: null,
      expected: "authenticate",
    },
    {
      action: undefined,
      loggedIn: true,
      userInfo: { user: {}, exists: true },
      expected: null,
    },
    {
      action: undefined,
      loggedIn: true,
      userInfo: null,
      expected: null,
    },
  ]

  test.each(cases)(
    "(%#) ($action, $userInfo, loggedIn: $loggedIn) = $expected",
    ({ action, userInfo, expected, loggedIn }) => {
      expect(inferWebAuthnOptions(action, loggedIn, userInfo)).toEqual(expected)
    }
  )
})

describe("getRegistrationResponse", () => {
  it("generates registration response", async () => {
    const options = getMockOptions()
    const user = { id: "123", email: "test@example.com", name: "Test User" }
    const authenticators = [createAuthenticator(), createAuthenticator()]
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(options.adapter.listAuthenticatorsByUserId).mockResolvedValue(
      authenticators
    )
    vi.mocked(generateRegistrationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateRegistrationOptionsOpts = {
      ...defaultWebAuthnConfig.registrationOptions,
      rpID: rp.id,
      rpName: rp.name,
      userID: expect.any(String),
      userName: user.email,
      userDisplayName: user.name,
      excludeCredentials: authenticators.map((a) => ({
        id: a.credentialID,
        type: "public-key",
        transports: stringToTransports(a.transports),
      })),
    }
    const cookies = [{ name: "other", value: "value", options: {} }]
    const expectedResponse = getExpectedResponse(
      "register",
      returnedOptions,
      cookies
    )

    expect(
      await getRegistrationResponse(
        options,
        {} as RequestInternal,
        user,
        cookies
      )
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge",
      user
    )
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).toHaveBeenCalledWith(
      "123"
    )
  })

  it("uses provider override options", async () => {
    const options = getMockOptions(
      {},
      {
        registrationOptions: {
          // @ts-expect-error
          userID: "test",
          attestationType: "none",
          timeout: 1000,
          authenticatorSelection: {
            requireResidentKey: true,
          },
          supportedAlgorithmIDs: [1, 2, 3],
        },
      }
    )
    const user = { id: "123", email: "test@example.com", name: "Test User" }
    const authenticators = [createAuthenticator(), createAuthenticator()]
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(options.adapter.listAuthenticatorsByUserId).mockResolvedValue(
      authenticators
    )
    vi.mocked(generateRegistrationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateRegistrationOptionsOpts = {
      ...defaultWebAuthnConfig.registrationOptions,
      rpID: rp.id,
      rpName: rp.name,
      userID: expect.any(String),
      userName: user.email,
      userDisplayName: user.name,
      excludeCredentials: authenticators.map((a) => ({
        id: a.credentialID,
        type: "public-key",
        transports: stringToTransports(a.transports),
      })),
      timeout: 1000,
      attestationType: "none",
      authenticatorSelection: {
        requireResidentKey: true,
      },
      supportedAlgorithmIDs: [1, 2, 3],
    }
    const expectedResponse = getExpectedResponse("register", returnedOptions)

    expect(
      await getRegistrationResponse(options, {} as RequestInternal, user)
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge",
      user
    )
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).toHaveBeenCalledWith(
      "123"
    )
  })

  it("doesn't get authenticators for new users", async () => {
    const options = getMockOptions()
    const user = { email: "test@example.com", name: "Test User" }
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(generateRegistrationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateRegistrationOptionsOpts = {
      ...defaultWebAuthnConfig.registrationOptions,
      rpID: rp.id,
      rpName: rp.name,
      userID: expect.any(String),
      userName: user.email,
      userDisplayName: user.name,
      excludeCredentials: undefined,
    }
    const expectedResponse = getExpectedResponse("register", returnedOptions)

    expect(
      await getRegistrationResponse(options, {} as RequestInternal, user)
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge",
      user
    )
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).not.toHaveBeenCalled()
  })

  it("allows missing userName", async () => {
    const options = getMockOptions()
    const user = { email: "test@example.com" }
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(generateRegistrationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateRegistrationOptionsOpts = {
      ...defaultWebAuthnConfig.registrationOptions,
      rpID: rp.id,
      rpName: rp.name,
      userID: expect.any(String),
      userName: user.email,
      userDisplayName: undefined,
      excludeCredentials: undefined,
    }
    const expectedResponse = getExpectedResponse("register", returnedOptions)

    expect(
      await getRegistrationResponse(options, {} as RequestInternal, user)
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge",
      user
    )
    expect(generateRegistrationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).not.toHaveBeenCalled()
  })
})

describe("getAuthenticationResponse", () => {
  it("generates authentication response", async () => {
    const options = getMockOptions()
    const user = { id: "123", email: "test@example.com", name: "Test User" }
    const authenticators = [createAuthenticator(), createAuthenticator()]
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(options.adapter.listAuthenticatorsByUserId).mockResolvedValue(
      authenticators
    )
    vi.mocked(generateAuthenticationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateAuthenticationOptionsOpts = {
      ...defaultWebAuthnConfig.authenticationOptions,
      rpID: rp.id,
      allowCredentials: authenticators.map((a) => ({
        id: a.credentialID,
        type: "public-key",
        transports: stringToTransports(a.transports),
      })),
    }
    const cookies = [{ name: "other", value: "value", options: {} }]
    const expectedResponse = getExpectedResponse(
      "authenticate",
      returnedOptions,
      cookies
    )

    expect(
      await getAuthenticationResponse(
        options,
        {} as RequestInternal,
        user,
        cookies
      )
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge"
    )
    expect(generateAuthenticationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).toHaveBeenCalledWith(
      "123"
    )
  })

  it("uses provider override options", async () => {
    const options = getMockOptions(
      {},
      {
        authenticationOptions: {
          extensions: {
            appid: "test",
          },
          timeout: 1000,
          userVerification: "required",
        },
      }
    )
    const user = { id: "123", email: "test@example.com", name: "Test User" }
    const authenticators = [createAuthenticator(), createAuthenticator()]
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(options.adapter.listAuthenticatorsByUserId).mockResolvedValue(
      authenticators
    )
    vi.mocked(generateAuthenticationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateAuthenticationOptionsOpts = {
      ...defaultWebAuthnConfig.authenticationOptions,
      rpID: rp.id,
      allowCredentials: authenticators.map((a) => ({
        id: a.credentialID,
        type: "public-key",
        transports: stringToTransports(a.transports),
      })),
      timeout: 1000,
      userVerification: "required",
      extensions: {
        appid: "test",
      },
    }
    const cookies = [{ name: "other", value: "value", options: {} }]
    const expectedResponse = getExpectedResponse(
      "authenticate",
      returnedOptions,
      cookies
    )

    expect(
      await getAuthenticationResponse(
        options,
        {} as RequestInternal,
        user,
        cookies
      )
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge"
    )
    expect(generateAuthenticationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).toHaveBeenCalledWith(
      "123"
    )
  })

  it("accepts undefined user", async () => {
    const options = getMockOptions()
    const user = undefined
    const returnedOptions = {
      challenge: "mychallenge",
    } as unknown as PublicKeyCredentialCreationOptionsJSON

    vi.mocked(generateAuthenticationOptions).mockResolvedValue(returnedOptions)

    const rp = options.provider.getRelayingParty(options, {} as RequestInternal)
    const expectedOptionsParams: GenerateAuthenticationOptionsOpts = {
      ...defaultWebAuthnConfig.authenticationOptions,
      rpID: rp.id,
      allowCredentials: undefined,
    }
    const cookies = [{ name: "other", value: "value", options: {} }]
    const expectedResponse = getExpectedResponse(
      "authenticate",
      returnedOptions,
      cookies
    )

    expect(
      await getAuthenticationResponse(
        options,
        {} as RequestInternal,
        user,
        cookies
      )
    ).toEqual(expectedResponse)

    expect(webauthnChallenge.create).toHaveBeenCalledWith(
      options,
      "mychallenge"
    )
    expect(generateAuthenticationOptions).toHaveBeenCalledWith(
      expectedOptionsParams
    )
    expect(options.adapter.listAuthenticatorsByUserId).not.toHaveBeenCalled()
  })
})

describe("verifyAuthenticate", () => {
  it("verifies authentication response", async () => {
    const {
      account,
      user,
      options,
      request,
      cookies,
      credentialID,
      newCounter,
      expectedAuthenticationResponse,
    } = prepareVerifyTest("authenticate")

    expect(await verifyAuthenticate(options, request, cookies)).toEqual({
      account,
      user,
    })

    expect(options.adapter.getAuthenticator).toHaveBeenCalledWith(credentialID)
    expect(webauthnChallenge.use).toHaveBeenCalledWith(
      options,
      "reqcookies",
      cookies
    )
    expect(verifyAuthenticationResponse).toHaveBeenCalledWith(
      expectedAuthenticationResponse
    )
    expect(options.adapter.updateAuthenticatorCounter).toHaveBeenCalledWith(
      credentialID,
      newCounter
    )
    expect(options.adapter.getAccount).toHaveBeenCalledWith(
      credentialID,
      "webauthn"
    )
    expect(options.adapter.getUser).toHaveBeenCalledWith(user.id)
  })

  it("provider overrides verify options", async () => {
    const {
      account,
      user,
      options,
      request,
      cookies,
      expectedAuthenticationResponse,
    } = prepareVerifyTest("authenticate")
    options.provider.verifyAuthenticationOptions = {
      ...options.provider.verifyAuthenticationOptions,
      expectedType: "public-key",
      requireUserVerification: true,
    }

    expect(await verifyAuthenticate(options, request, cookies)).toEqual({
      account,
      user,
    })

    expect(verifyAuthenticationResponse).toHaveBeenCalledWith({
      ...expectedAuthenticationResponse,
      expectedType: "public-key",
      requireUserVerification: true,
    })
  })

  it("errors on invalid request body", async () => {
    const { options, request, cookies } = prepareVerifyTest("authenticate", {
      key: "value",
    })

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[AuthError: Invalid WebAuthn Authentication response. Read more at https://errors.authjs.dev#autherror]`
    )

    expect(webauthnChallenge.use).not.toHaveBeenCalled()
    expect(options.adapter.updateAuthenticatorCounter).not.toHaveBeenCalled()
  })

  it("errors on invalid authenticator", async () => {
    const { options, request, cookies, credentialID } =
      prepareVerifyTest("authenticate")

    vi.mocked(options.adapter.getAuthenticator).mockResolvedValue(null)

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[AuthError: WebAuthn authenticator not found in database: {"credentialID":"AQIDBAU="}. Read more at https://errors.authjs.dev#autherror]`
    )

    expect(options.adapter.getAuthenticator).toHaveBeenCalledWith(credentialID)
    expect(webauthnChallenge.use).not.toHaveBeenCalled()
    expect(options.adapter.updateAuthenticatorCounter).not.toHaveBeenCalled()
  })

  it("errors on failed response verification", async () => {
    const { options, request, cookies, expectedAuthenticationResponse } =
      prepareVerifyTest("authenticate")

    vi.mocked(verifyAuthenticationResponse).mockRejectedValue(
      new Error("mytesterror")
    )

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrow(WebAuthnVerificationError)

    expect(verifyAuthenticationResponse).toHaveBeenCalledWith(
      expectedAuthenticationResponse
    )
    expect(options.adapter.updateAuthenticatorCounter).not.toHaveBeenCalled()
  })

  it("errors on failed verification verified", async () => {
    const { options, request, cookies, expectedAuthenticationResponse } =
      prepareVerifyTest("authenticate")

    // @ts-expect-error
    vi.mocked(verifyAuthenticationResponse).mockResolvedValue({
      verified: false,
    })

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrow(WebAuthnVerificationError)

    expect(verifyAuthenticationResponse).toHaveBeenCalledWith(
      expectedAuthenticationResponse
    )
    expect(options.adapter.updateAuthenticatorCounter).not.toHaveBeenCalled()
  })

  it("errors if authenticator update fails", async () => {
    const { options, request, cookies, credentialID, newCounter } =
      prepareVerifyTest("authenticate")

    vi.mocked(options.adapter.updateAuthenticatorCounter).mockRejectedValue(
      new Error("mytesterror")
    )

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrowError(AdapterError)

    expect(options.adapter.updateAuthenticatorCounter).toHaveBeenCalledWith(
      credentialID,
      newCounter
    )
  })

  it("errors if account does not exist", async () => {
    const { options, request, cookies, credentialID } =
      prepareVerifyTest("authenticate")

    vi.mocked(options.adapter.getAccount).mockResolvedValue(null)

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[AuthError: WebAuthn account not found in database: {"credentialID":"AQIDBAU=","providerAccountId":"AQIDBAU="}. Read more at https://errors.authjs.dev#autherror]`
    )

    expect(options.adapter.getAccount).toHaveBeenCalledWith(
      credentialID,
      "webauthn"
    )
  })

  it("errors if user does not exist", async () => {
    const { options, request, cookies, user } =
      prepareVerifyTest("authenticate")

    vi.mocked(options.adapter.getUser).mockResolvedValue(null)

    await expect(() =>
      verifyAuthenticate(options, request, cookies)
    ).rejects.toThrow(AuthError)

    expect(options.adapter.getUser).toHaveBeenCalledWith(user.id)
  })
})

describe("verifyRegister", () => {
  it("verifies registration response", async () => {
    const {
      account: { userId, ...account },
      user: { id, ...user },
      options,
      request,
      cookies,
      authenticator: { userId: auid, ...authenticator },
      expectedRegistrationResponse,
    } = prepareVerifyTest("register")
    vi.mocked(webauthnChallenge.use).mockResolvedValue({
      challenge: "mychallenge",
      registerData: user,
    })

    expect(await verifyRegister(options, request, cookies)).toEqual({
      account,
      user,
      authenticator,
    })

    expect(webauthnChallenge.use).toHaveBeenCalledWith(
      options,
      request.cookies,
      cookies
    )
    expect(verifyRegistrationResponse).toHaveBeenCalledWith(
      expectedRegistrationResponse
    )
  })

  it("provider overrides verification options", async () => {
    const {
      account: { userId, ...account },
      user: { id, ...user },
      options,
      request,
      cookies,
      authenticator: { userId: auid, ...authenticator },
      expectedRegistrationResponse,
    } = prepareVerifyTest("register")
    vi.mocked(webauthnChallenge.use).mockResolvedValue({
      challenge: "mychallenge",
      registerData: user,
    })
    options.provider.verifyRegistrationOptions = {
      ...options.provider.verifyRegistrationOptions,
      expectedType: "public-key",
      requireUserVerification: true,
      supportedAlgorithmIDs: [1, 2, 3],
    }

    expect(await verifyRegister(options, request, cookies)).toEqual({
      account,
      user,
      authenticator,
    })

    expect(verifyRegistrationResponse).toHaveBeenCalledWith({
      ...expectedRegistrationResponse,
      expectedType: "public-key",
      requireUserVerification: true,
      supportedAlgorithmIDs: [1, 2, 3],
    })
  })

  it("fails on invalid request body", async () => {
    const {
      user: { id, ...user },
      options,
      request,
      cookies,
    } = prepareVerifyTest("register", { key: "value" })

    await expect(() =>
      verifyRegister(options, request, cookies)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[AuthError: Invalid WebAuthn Registration response. Read more at https://errors.authjs.dev#autherror]`
    )

    expect(webauthnChallenge.use).not.toHaveBeenCalled()
    expect(verifyRegistrationResponse).not.toHaveBeenCalled()
  })

  it("errors on missing registration data in challenge cookie", async () => {
    const { options, request, cookies } = prepareVerifyTest("register")

    await expect(() =>
      verifyRegister(options, request, cookies)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[AuthError: Missing user registration data in WebAuthn challenge cookie. Read more at https://errors.authjs.dev#autherror]`
    )

    expect(webauthnChallenge.use).toHaveBeenCalledWith(
      options,
      request.cookies,
      cookies
    )
    expect(verifyRegistrationResponse).not.toHaveBeenCalled()
  })

  it("errors on failed verification", async () => {
    const {
      account: { userId, ...account },
      user: { id, ...user },
      options,
      request,
      cookies,
      authenticator: { userId: auid, ...authenticator },
      expectedRegistrationResponse,
    } = prepareVerifyTest("register")
    vi.mocked(webauthnChallenge.use).mockResolvedValue({
      challenge: "mychallenge",
      registerData: user,
    })
    vi.mocked(verifyRegistrationResponse).mockRejectedValue(
      new Error("mytesterror")
    )

    await expect(() =>
      verifyRegister(options, request, cookies)
    ).rejects.toThrow(WebAuthnVerificationError)

    expect(webauthnChallenge.use).toHaveBeenCalledWith(
      options,
      request.cookies,
      cookies
    )
    expect(verifyRegistrationResponse).toHaveBeenCalledWith(
      expectedRegistrationResponse
    )
  })

  it("errors on failed verification verified", async () => {
    const {
      account: { userId, ...account },
      user: { id, ...user },
      options,
      request,
      cookies,
      authenticator: { userId: auid, ...authenticator },
      expectedRegistrationResponse,
    } = prepareVerifyTest("register")
    vi.mocked(webauthnChallenge.use).mockResolvedValue({
      challenge: "mychallenge",
      registerData: user,
    })
    vi.mocked(verifyRegistrationResponse).mockResolvedValue({ verified: false })

    await expect(() =>
      verifyRegister(options, request, cookies)
    ).rejects.toThrow(WebAuthnVerificationError)

    expect(webauthnChallenge.use).toHaveBeenCalledWith(
      options,
      request.cookies,
      cookies
    )
    expect(verifyRegistrationResponse).toHaveBeenCalledWith(
      expectedRegistrationResponse
    )
  })
})
