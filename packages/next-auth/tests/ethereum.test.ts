import { createCSRF, handler, mockAdapter } from "./lib"

import type { AdapterUser } from "../src/adapters"
import { CallbacksOptions } from "../src/core/types"
import EthereumProvider from "../src/providers/ethereum"
import { SiweMessage } from "siwe"
import { ethers } from "ethers"

let csrf: { value: string; token: string; cookie: string }
let secret: string
let testMessage: SiweMessage
let wallet: ethers.Wallet

describe("Ethereum Provider", () => {
  beforeEach(async () => {
    // NOTE: One strategy is to use the CSRF value as the nonce on the SIWE message.
    // The previous test value of "csrf" is not long enough to be a valid nonce.
    const csrfResult = await createCSRF("supersecurecsrfvalue")
    secret = csrfResult.secret
    csrf = csrfResult.csrf

    wallet = new ethers.Wallet(
      "0xacf31b9822a6c78768ff69efc92425f6588000952bcc3d0e4ee10d3fbf142598"
    ) // 0x8c77aC88e481FDFAcD801dF29C406b545883467d

    testMessage = new SiweMessage({
      domain: "localhost:3000",
      address: wallet.address,
      statement: "Sign in test",
      uri: "http://localhost:3000",
      version: "1",
      chainId: 1,
      nonce: csrf.value,
    })
  })

  it("redirects on an invalid signature", async () => {
    const ethereumProvider = EthereumProvider({})
    const authorizeSpy = jest.spyOn(ethereumProvider, "verifySignature")

    const { res } = await handler(
      {
        adapter: mockAdapter(),
        providers: [ethereumProvider],
        callbacks: {},
        secret,
      },
      {
        path: "callback/ethereum",
        requestInit: {
          method: "POST",
          headers: { cookie: csrf.cookie },
          body: JSON.stringify({
            message: "auth message",
            signature: "0xsignme",
            csrfToken: csrf.value,
          }),
        },
      }
    )
    expect(authorizeSpy.mock.calls[0][0]).toEqual({
      csrfToken: csrf.value,
      domain: "localhost:3000",
      message: "auth message",
      signature: "0xsignme"
    })

    expect(res.redirect).toEqual(
      "http://localhost:3000/api/auth/error?error=EthereumSignin&provider=ethereum"
    )
  })

  it("fetches a user if one exists in the database", async () => {
    const signIn = jest.fn<boolean, Parameters<CallbacksOptions["signIn"]>>(
      () => false
    )

    const ethereumProvider = EthereumProvider({})

    const testUser: AdapterUser = {
      id: "adapter-user-id",
      email: "",
      emailVerified: null,
    }

    const mockAdapterInstance = mockAdapter()
    mockAdapterInstance.getUserByAccount = jest
      .fn()
      .mockResolvedValueOnce(testUser)

    const testSignature = await wallet.signMessage(testMessage.prepareMessage())

    await handler(
      {
        adapter: mockAdapterInstance,
        providers: [ethereumProvider],
        callbacks: { signIn },
        secret,
      },
      {
        path: "callback/ethereum",
        requestInit: {
          method: "POST",
          headers: { cookie: csrf.cookie },
          body: JSON.stringify({
            message: testMessage.prepareMessage(),
            signature: testSignature,
            csrfToken: csrf.value,
          }),
        },
      }
    )
    expect(mockAdapterInstance.getUserByAccount).toHaveBeenCalledWith({
      provider: "ethereum",
      providerAccountId: wallet.address,
    })
    expect(signIn.mock.calls[0][0].user).toEqual(testUser)
  })

  it("calls signin after a valid signature", async () => {
    const signIn = jest.fn<boolean, Parameters<CallbacksOptions["signIn"]>>(
      () => false
    )

    const ethereumProvider = EthereumProvider({})

    const testSignature = await wallet.signMessage(testMessage.prepareMessage())

    const { res } = await handler(
      {
        adapter: mockAdapter(),
        providers: [ethereumProvider],
        callbacks: { signIn },
        secret,
      },
      {
        path: "callback/ethereum",
        requestInit: {
          method: "POST",
          headers: { cookie: csrf.cookie },
          body: JSON.stringify({
            message: testMessage.prepareMessage(),
            signature: testSignature,
            csrfToken: csrf.value,
          }),
        },
      }
    )

    expect(signIn).toHaveBeenCalledWith({
      account: {
        provider: "ethereum",
        providerAccountId: wallet.address,
        type: "ethereum",
      },
      user: {
        id: wallet.address,
      },
    })

    expect(res.redirect).toEqual(
      "http://localhost:3000/api/auth/error?error=AccessDenied"
    )
  })

  it("creates a new user if none exists", async () => {
    const ethereumProvider = EthereumProvider({})

    const testUser: AdapterUser = {
      id: "adapter-user-id",
      email: "",
      emailVerified: null,
    }
    const mockAdapterInstance = mockAdapter()
    mockAdapterInstance.createUser = jest.fn().mockResolvedValueOnce(testUser)

    const testSignature = await wallet.signMessage(testMessage.prepareMessage())

    await handler(
      {
        adapter: mockAdapterInstance,
        providers: [ethereumProvider],
        callbacks: {},
        secret,
      },
      {
        path: "callback/ethereum",
        requestInit: {
          method: "POST",
          headers: { cookie: csrf.cookie },
          body: JSON.stringify({
            message: testMessage.prepareMessage(),
            signature: testSignature,
            csrfToken: csrf.value,
          }),
        },
      }
    )

    expect(mockAdapterInstance.createUser).toHaveBeenCalledWith({
      email: null,
      emailVerified: null,
      name: wallet.address,
    })

    expect(mockAdapterInstance.linkAccount).toHaveBeenCalledWith({
      provider: "ethereum",
      providerAccountId: wallet.address,
      type: "ethereum",
      userId: "adapter-user-id",
    })
  })

  it("creates a session", async () => {
    const ethereumProvider = EthereumProvider({})

    const testUser: AdapterUser = {
      id: "adapter-user-id",
      email: "",
      emailVerified: null,
    }

    const mockAdapterInstance = mockAdapter()
    mockAdapterInstance.getUserByAccount = jest.fn().mockResolvedValue(testUser)
    mockAdapterInstance.createSession = jest
      .fn()
      .mockImplementationOnce(async (x) => x)

    const testSignature = await wallet.signMessage(testMessage.prepareMessage())

    const { res } = await handler(
      {
        adapter: mockAdapterInstance,
        providers: [ethereumProvider],
        callbacks: {},
        secret,
      },
      {
        path: "callback/ethereum",
        requestInit: {
          method: "POST",
          headers: { cookie: csrf.cookie },
          body: JSON.stringify({
            message: testMessage.prepareMessage(),
            signature: testSignature,
            csrfToken: csrf.value,
          }),
        },
      }
    )

    expect(mockAdapterInstance.createSession).toHaveBeenCalled()
    expect(
      (mockAdapterInstance.createSession as jest.Mock).mock.calls[0][0].userId
    ).toEqual("adapter-user-id")
    const sessionToken = (mockAdapterInstance.createSession as jest.Mock).mock
      .calls[0][0].sessionToken
    expect(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
        sessionToken
      )
    ).toEqual(true)
    expect(
      (mockAdapterInstance.createSession as jest.Mock).mock.calls[0][0].expires
    ).toBeInstanceOf(Date)

    expect(res.redirect).toEqual("http://localhost:3000")
  })
})
