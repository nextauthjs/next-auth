import { Account } from "next-auth";
import type { Adapter, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters"
import { Headers, RequestInfo, RequestInit, Response } from "node-fetch"
import fetch from "node-fetch"

export class ChiselStrikeAuthFetcher {
    url: string; /// ChiselStrike backend.
    secret: string;

    /// Makes a fetcher pointing to the ChiselStrike backend at this URL.  Use the secret provided by the ChiselStrike platform.
    constructor(url: string, secret: string) {
        this.url = url
        this.secret = secret
    }

    /// Returns a ChiselStrike server auth path with this suffix.
    private auth(suffix: string): string {
        return `${this.url}/__chiselstrike/auth/${suffix}`
    }

    public sessions(suffix?: string): string {
        return this.auth('sessions') + (suffix ?? '');
    }

    public accounts(suffix?: string): string {
        return this.auth('accounts') + (suffix ?? '');
    }

    public users(suffix?: string): string {
        return this.auth('users') + (suffix ?? '');
    }

    public tokens(suffix?: string): string {
        return this.auth('tokens') + (suffix ?? '');
    }

    /// Like regular fetch(), but adds a header with this.secret.
    public async fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
        init ??= {}
        init.headers = new Headers(init.headers)
        init.headers.set('ChiselAuth', this.secret)
        return fetch(input, init)
    }

    /// Fetches url and returns the first element of the resulting array (or null if anything goes wrong).
    public async filter(url: string): Promise<null | { [_: string]: string }> {
        const res = await this.fetch(url)
        if (!res.ok) { return null }
        const jres = await res.json()
        if (!Array.isArray(jres.results) || jres.results.length < 1) { return null }
        return jres.results[0]
    }

    public async deleteEverything() {
        await this.fetch(this.sessions('?all=true'), { method: 'DELETE' })
        await this.fetch(this.accounts('?all=true'), { method: 'DELETE' })
        await this.fetch(this.users('?all=true'), { method: 'DELETE' })
        await this.fetch(this.tokens('?all=true'), { method: 'DELETE' })
    }
}

export function ChiselStrikeAdapter(fetcher: ChiselStrikeAuthFetcher): Adapter {
    return {
        createUser: async (user: Omit<AdapterUser, "id">): Promise<AdapterUser> => {
            const resp = await fetcher.fetch(fetcher.users(), { method: 'POST', body: JSON.stringify(user) })
            await ensureOK(resp, `posting user ${JSON.stringify(user)}`);
            return userFromJson(await resp.json())
        },
        getUser: async (id: string): Promise<AdapterUser | null> => {
            const resp = await fetcher.fetch(fetcher.users(`/${id}`))
            if (!resp.ok) { return null }
            return userFromJson(await resp.json())
        },
        getUserByEmail: async (email: string): Promise<AdapterUser | null> => {
            return userFromJson(await fetcher.filter(fetcher.users(`?${makeFilter({ email })}`)))
        },
        updateUser: async (user: Partial<AdapterUser>): Promise<AdapterUser> => {
            // TODO: use PATCH
            const get = await fetcher.fetch(fetcher.users(`/${user.id}`))
            await ensureOK(get, `getting user ${user.id}`)
            let u = await get.json()
            Object.keys(user).forEach(key => u[key] = user[key])
            const body = JSON.stringify(u)
            const put = await fetcher.fetch(fetcher.users(`/${user.id}`), { method: 'PUT', body })
            await ensureOK(put, `writing user ${body}`)
            return userFromJson(u)
        },
        getUserByAccount: async (providerAccountId: Pick<Account, "provider" | "providerAccountId">): Promise<AdapterUser | null> => {
            const acct = await fetcher.filter(fetcher.accounts(`?${makeFilter(providerAccountId)}`))
            if (!acct) { return null }
            const uresp = await fetcher.fetch(fetcher.users(`/${acct.userId}`))
            await ensureOK(uresp, `getting user ${acct.userId}`)
            return userFromJson(await uresp.json())
        },
        // deleteUser?: ((userId: string) => Promise<void> | Awaitable<AdapterUser | null | undefined>) | undefined;
        deleteUser: async (userId: string): Promise<AdapterUser | null | undefined> => {
            let resp = await fetcher.fetch(fetcher.users(`/${userId}`), { method: 'DELETE' })
            await ensureOK(resp, `deleting user ${userId}`)
            resp = await fetcher.fetch(fetcher.sessions(`?.userId=${userId}`), { method: 'DELETE' })
            await ensureOK(resp, `deleting sessions for ${userId}`)
            resp = await fetcher.fetch(fetcher.accounts(`?.userId=${userId}`), { method: 'DELETE' })
            await ensureOK(resp, `deleting accounts for ${userId}`)
            return null
        },
        // linkAccount: (account: Account) => Promise<void> | Awaitable<Account | null | undefined>;
        linkAccount: async (account: Account): Promise<Account | null | undefined> => {
            const body = JSON.stringify(account);
            const resp = await fetcher.fetch(fetcher.accounts(), { method: 'POST', body })
            await ensureOK(resp, `posting account ${body}`);
            return (await resp.json()).results
        },
        // unlinkAccount?: ((providerAccountId: Pick<Account, "provider" | "providerAccountId">) => Promise<void> | Awaitable<Account | undefined>) | undefined;
        unlinkAccount: async (providerAccountId: Pick<Account, "provider" | "providerAccountId">): Promise<void> => {
            const resp = await fetcher.fetch(fetcher.accounts(`?${makeFilter(providerAccountId)}`), { method: 'DELETE' })
            await ensureOK(resp, `deleting account ${JSON.stringify(providerAccountId)}`)
        },
        // createSession: (session: { sessionToken: string; userId: string; expires: Date; }) => Awaitable<AdapterSession>;
        createSession: async (session: { sessionToken: string; userId: string; expires: Date; }): Promise<AdapterSession> => {
            const str = JSON.stringify(session);
            const resp = await fetcher.fetch(fetcher.sessions(), { method: 'POST', body: str })
            await ensureOK(resp, `posting session ${JSON.stringify(session)}`);
            return sessionFromJson(await resp.json())
        },
        // getSessionAndUser: (sessionToken: string) => Awaitable<{ session: AdapterSession; user: AdapterUser; } | null>;
        getSessionAndUser: async (sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser; } | null> => {
            const session = await fetcher.filter(fetcher.sessions(`?.sessionToken=${sessionToken}`))
            if (!session) { return null }
            const rUser = await fetcher.fetch(fetcher.users(`/${session.userId}`))
            await ensureOK(rUser, `fetching user ${session.userId}`)
            return { session: sessionFromJson(session), user: userFromJson(await rUser.json()) }
        },
        // updateSession: (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) => Awaitable<AdapterSession | null | undefined>;
        updateSession: async (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> => {
            // TODO: use PATCH
            const dbSession = await fetcher.filter(fetcher.sessions(`?.sessionToken=${session.sessionToken}`))
            if (!dbSession) { return null }
            Object.entries(session).forEach(([key, entry]) => {
                if (entry instanceof Date) {
                    dbSession[key] = entry.toISOString();
                } else {
                    dbSession[key] = entry;
                }
           });
            const body = JSON.stringify(dbSession)
            const put = await fetcher.fetch(fetcher.sessions(`/${dbSession.id}`), { method: 'PUT', body })
            await ensureOK(put, `writing user ${body}`)
            return dbSession as unknown as AdapterSession
        },
        // deleteSession: (sessionToken: string) => Promise<void> | Awaitable<AdapterSession | null | undefined>;
        deleteSession: async (sessionToken: string): Promise<void> => {
            const get = await fetcher.fetch(fetcher.sessions(`?${makeFilter({ sessionToken })}`), { method: 'DELETE' })
            await ensureOK(get, `getting session with token ${sessionToken}`)
        },
        // createVerificationToken?: ((verificationToken: VerificationToken) => Awaitable<VerificationToken | null | undefined>) | undefined;
        createVerificationToken: async (verificationToken: VerificationToken): Promise<VerificationToken | null | undefined> => {
            const str = JSON.stringify(verificationToken);
            const resp = await fetcher.fetch(fetcher.tokens(), { method: 'POST', body: str });
            await ensureOK(resp, `posting token ${str}`)
            const token = await resp.json()
            return { identifier: token.identifier, token: token.token, expires: new Date(token.expires) }
        },
        // useVerificationToken?: ((params: { identifier: string; token: string; }) => Awaitable<VerificationToken | null>) | undefined;
        useVerificationToken: async (params: { identifier: string; token: string; }): Promise<VerificationToken | null> => {
            const token = await fetcher.filter(fetcher.tokens(`?${makeFilter(params)}`))
            if (!token) { return null }
            await fetcher.fetch(fetcher.tokens(`/${token.id}`), { method: 'DELETE' })
            return { identifier: token.identifier, token: token.token, expires: new Date(token.expires) }
        }
    }
}

function userFromJson(json: any): AdapterUser {
    const user = json?.results ?? json
    return user ? { ...user, emailVerified: new Date(user.emailVerified) } : null
}

async function ensureOK(resp: Response, during: string) {
    if (!resp.ok) {
        const msg = `Error ${resp.status} during ${during}: ${await resp.text()}`;
        console.error(msg);
        throw msg;
    }
}

function sessionFromJson(json: any): AdapterSession {
    const session = json?.results ?? json
    return { ...session, expires: new Date(session.expires), id: session.id ?? 'impossible: fetched CSession has null ID' }
}

function makeFilter(propertyValues: Record<string, any>) {
    let filters = Object.entries(propertyValues).map(e => `.${e[0]}=${e[1]}`)
    return filters.join('&')
}