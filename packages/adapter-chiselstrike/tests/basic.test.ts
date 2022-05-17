import { runBasicTests } from "@next-auth/adapter-test"
import { ChiselStrikeAdapter } from "../src"
import fetch from "cross-fetch"

const adapter = new ChiselStrikeAdapter('http://localhost:8080', '1234');

runBasicTests(
    {
        adapter,
        db: {
            connect: async () => {
                await adapter.deleteEverything()
            },
            session: async (sessionToken: string) => {
                const s = await adFetch(adapter.sessions(`?.sessionToken=${sessionToken}`), `session ${sessionToken}`)
                return s ? { ...s, expires: new Date(s.expires) } : null
            },
            user: async (id: string) => {
                return await adapter.getUser(id)
            },
            account: async (providerAccountId: { provider: string; providerAccountId: string }) => {
                const providerFilter = providerAccountId.provider ? `.provider=${providerAccountId.provider}` : ''
                const providerAccountIdFilter =
                    providerAccountId.providerAccountId ? `.providerAccountId=${providerAccountId.providerAccountId}` : ''
                return await adFetch(
                    adapter.accounts(`?${providerFilter}&${providerAccountIdFilter}`),
                    `account ${JSON.stringify(providerAccountId)}`)
            },
            verificationToken: async (params: { identifier: string; token: string }) => {
                const idFilter = `.identifier=${params.identifier}`
                const tokenFilter = `.token=${params.token}`
                let token = await adFetch(
                    adapter.tokens(`?${idFilter}&${tokenFilter}`),
                    `Fetching token ${JSON.stringify(params)}`)
                return token ? { ...token, expires: new Date(token.expires), id: undefined } : null
            }
        }
    }
)

/// Fetches an object via adapter, performing common error-checking.
async function adFetch(url: string, what: string): Promise<null | { [_: string]: string }> {
    const res = await adapter.secFetch(url);
    if (!res.ok) { return null }
    const jres = await res.json();
    if (!Array.isArray(jres)) { throw new Error(`Fetch result for ${what}: ${JSON.stringify(jres)}`); }
    return jres.length < 1 ? null : jres[0];
}