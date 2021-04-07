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

// $ExpectType [Session | null | undefined, boolean]
client.useSession()

// $ExpectType Promise<Session | null>
client.getSession({ req: nextReq })

// $ExpectType Promise<Session | null>
client.session({ req: nextReq })

// $ExpectType Promise<Record<string, AppProvider> | null>
client.getProviders()

// $ExpectType Promise<Record<string, AppProvider> | null>
client.providers()

// $ExpectType Promise<string | null>
client.getCsrfToken({ req: nextReq })

// $ExpectType Promise<string | null>
client.csrfToken({ req: nextReq })

// $ExpectType Promise<void>
client.signin("github", { data: "foo", redirect: false }, { login: "username" })

// $ExpectType Promise<SignInResponse>
client.signin("credentials", { data: "foo", redirect: false })

// $ExpectType Promise<SignInResponse>
client.signin("email", { data: "foo", redirect: false })

// $ExpectType Promise<void>
client.signin("email", { data: "foo", redirect: true })

// $ExpectType Promise<void>
client.signout()

// $ExpectType Promise<void>
client.signout({ callbackUrl: "https://foo.com/callback", redirect: true })

// $ExpectType ReactElement<any, any> | null
client.Provider({
  session: clientSession,
  options: {
    baseUrl: "https://foo.com",
    basePath: "/",
    clientMaxAge: 1234,
  },
})

// $ExpectType ReactElement<any, any> | null
client.Provider({
  session: clientSession,
})

// $ExpectType ReactElement<any, any> | null
client.Provider({
  session: undefined,
  options: {},
})

// $ExpectType ReactElement<any, any> | null
client.Provider({
  session: null,
  options: {
    baseUrl: "https://foo.com",
    basePath: "/",
    clientMaxAge: 1234,
    keepAlive: 4321,
  },
})
