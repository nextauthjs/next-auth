import Fastify, { LightMyRequestResponse } from "fastify"
import formbodyParser from "@fastify/formbody"
import { FastifyAuth, getSession } from "../../src/index.js"

import CredentialsProvider from "@auth/core/providers/credentials"
export const authConfig = {
  secret: "secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const name = (credentials.username as string) || "Default Name"
        const user = {
          id: "1",
          name,
          email: name.replace(" ", "") + "@example.com",
        }

        return user
      },
    }),
  ],
}

const extractCookieValue = (cookies: LightMyRequestResponse['cookies'], name: string) => {
  const cookie = cookies.find(({name: _name}) => _name === name)
  return cookie?.value
};

describe("Integration test with login and getSession", () => {
  let fastify: ReturnType<typeof Fastify>

  beforeEach(() => {
    fastify = Fastify()
  })

  it("Should return the session with username after logging in", async () => {
    let expectations = async () => {}

    fastify.register(formbodyParser)

    fastify.register(FastifyAuth(authConfig), { prefix: '/api/auth' });

    fastify.post('/test', async (request, reply) => {
      const session = await getSession(request, authConfig);

      expectations = async () => {
        expect(session?.user?.name).toEqual('johnsmith');
      };

      return 'OK';
    });

    await fastify.ready();

    // Get signin page
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/auth/signin',
      headers: {
        'X-Test-Header': 'foo',
        'Accept': 'application/json',
      },
    });

    // Parse cookies for csrf token and callback url
    const csrfTokenCookie = extractCookieValue(response.cookies, 'authjs.csrf-token') ?? '';
    const callbackCookie = extractCookieValue(response.cookies, 'authjs.callback-url') ?? '';
    const csrfFromCookie = csrfTokenCookie?.split("|")[0] ?? ''

    // Get csrf token. We could just strip the csrf cookie but this tests the csrf endpoint as well.
    const responseCsrf = await fastify.inject({
      method: 'GET',
      url: '/api/auth/csrf',
      headers: { 'Accept': 'application/json' },
      cookies: { 'authjs.csrf-token': csrfTokenCookie },
    });
    const csrfTokenValue = JSON.parse(responseCsrf.body).csrfToken;

    // Check that csrf tokens are the same
    expect(csrfTokenValue).toEqual(csrfFromCookie);

    // Sign in
    const responseCredentials = await fastify.inject({
      method: 'POST',
      url: '/api/auth/callback/credentials',
      cookies: {
        'authjs.csrf-token': csrfTokenCookie,
        'authjs.callback-url': callbackCookie,
      },
      payload: {
        csrfToken: csrfTokenValue,
        username: 'johnsmith',
        password: 'ABC123',
      },
    });

    // Parse cookie for session token
    const sessionTokenCookie = extractCookieValue(responseCredentials.cookies, 'authjs.session-token') ?? '';

    // Call test route
    await fastify.inject({
      method: 'POST',
      url: '/test',
      headers: {
        'X-Test-Header': 'foo',
        'Accept': 'application/json',
      },
      cookies: {
        'authjs.csrf-token': csrfTokenCookie,
        'authjs.callback-url': callbackCookie,
        'authjs.session-token': sessionTokenCookie,
      },
    })

    await expectations()
  })
})
