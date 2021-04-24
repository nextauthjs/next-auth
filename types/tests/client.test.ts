import * as client from "next-auth/client"
import { nextReq } from "./test-helpers"

const clientSession = {
  user: {
    name: "Bruce",
    email: "bruce@lee.com",
    image: "path/to/img",
  },
  accessToken: "123z",
  expires: "1234",
}

// $ExpectType [Session | null, boolean]
client.useSession()

// $ExpectType Promise<Session | null>
client.getSession({ req: nextReq })

// $ExpectType Promise<Session | null>
client.session({ req: nextReq })

// $ExpectType Promise<Record<string, ClientSafeProvider> | null>
client.getProviders()

// $ExpectType Promise<Record<string, ClientSafeProvider> | null>
client.providers()

// $ExpectType Promise<string | null>
client.getCsrfToken({ req: nextReq })

// $ExpectType Promise<string | null>
client.csrfToken({ req: nextReq })

// $ExpectType Promise<string | null>
client.csrfToken({ ctx: { req: nextReq } })

// $ExpectType Promise<undefined>
client.signin("github", { callbackUrl: "foo" }, { login: "username" })

// $ExpectType Promise<SignInResponse | undefined>
client.signin("credentials", { callbackUrl: "foo", redirect: true })

// $ExpectType Promise<SignInResponse | undefined>
client.signin("credentials", { redirect: false })

// $ExpectType Promise<SignInResponse | undefined>
client.signin("email", { callbackUrl: "foo", redirect: false })

// $ExpectType Promise<SignInResponse | undefined>
client.signin("email", { callbackUrl: "foo", redirect: true })

// $ExpectType Promise<undefined>
client.signout()

// $ExpectType Promise<undefined>
client.signout({ callbackUrl: "https://foo.com/callback", redirect: true })

// $ExpectType Promise<SignOutResponse>
client.signOut({ callbackUrl: "https://foo.com/callback", redirect: false })

// $ExpectType ReactElement<any, any> | null
client.Provider({
  children: null,
  session: clientSession,
  options: {
    baseUrl: "https://foo.com",
    basePath: "/",
    clientMaxAge: 1234,
  },
})

// $ExpectType ReactElement<any, any> | null
client.Provider({
  children: null,
  session: clientSession,
})

// $ExpectType ReactElement<any, any> | null
client.Provider({
  children: null,
  options: {},
})

// $ExpectType ReactElement<any, any> | null
client.Provider({
  children: null,
  session: {
    expires: "",
  },
  options: {
    baseUrl: "https://foo.com",
    basePath: "/",
    clientMaxAge: 1234,
    keepAlive: 4321,
  },
})
