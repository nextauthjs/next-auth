import { fetch, Headers } from "cross-fetch";
import { Account } from "next-auth";
import type { Adapter, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters"

export class ChiselStrikeAdapter implements Adapter {
    url: string; /// ChiselStrike backend.
    secret: string;

    /// Makes an adapter connected to the ChiselStrike backend at this URL.  Use the secret provided by the ChiselStrike platform.
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

    /// Like fetch(), but adds a header with this.password.
    public async secFetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
        init ??= {}
        init.headers = new Headers(init.headers)
        init.headers.set('ChiselAuth', this.secret)
        return fetch(input, init)
    }

    createUser = async (user: Omit<AdapterUser, "id">): Promise<AdapterUser> => {
        const resp = await this.secFetch(this.users(), { method: 'POST', body: JSON.stringify(user) })
        await ensureOK(resp, `posting user ${JSON.stringify(user)}`);
        return userFromJson(await resp.json())
    }

    getUser = async (id: string): Promise<AdapterUser | null> => {
        const resp = await this.secFetch(this.users(`/${id}`))
        if (!resp.ok) { return null }
        return userFromJson(await resp.json())
    }

    getUserByEmail = async (email: string): Promise<AdapterUser | null> => {
        return userFromJson(await firstElementOrNull(await this.secFetch(this.users(`?${makeFilter({ email })}`))))
    }

    updateUser = async (user: Partial<AdapterUser>): Promise<AdapterUser> => {
        // TODO: use PATCH
        const get = await this.secFetch(this.users(`/${user.id}`))
        await ensureOK(get, `getting user ${user.id}`)
        let u = await get.json()
        Object.keys(user).forEach(key => u[key] = user[key])
        const body = JSON.stringify(u)
        const put = await this.secFetch(this.users(`/${user.id}`), { method: 'PUT', body })
        await ensureOK(put, `writing user ${body}`)
        return userFromJson(u)
    }

    getUserByAccount = async (providerAccountId: Pick<Account, "provider" | "providerAccountId">): Promise<AdapterUser | null> => {
        const acct = await firstElementOrNull(await this.secFetch(this.accounts(`?${makeFilter(providerAccountId)}`)))
        if (!acct) { return null }
        const uresp = await this.secFetch(this.users(`/${acct.userId}`))
        await ensureOK(uresp, `getting user ${acct.userId}`)
        return userFromJson(await uresp.json())
    }

    // deleteUser?: ((userId: string) => Promise<void> | Awaitable<AdapterUser | null | undefined>) | undefined;
    deleteUser = async (userId: string): Promise<AdapterUser | null | undefined> => {
        let resp = await this.secFetch(this.users(`/${userId}`), { method: 'DELETE' })
        await ensureOK(resp, `deleting user ${userId}`)
        resp = await this.secFetch(this.sessions(`?.userId=${userId}`), { method: 'DELETE' })
        await ensureOK(resp, `deleting sessions for ${userId}`)
        resp = await this.secFetch(this.accounts(`?.userId=${userId}`), { method: 'DELETE' })
        await ensureOK(resp, `deleting accounts for ${userId}`)
        return null
    }

    // linkAccount: (account: Account) => Promise<void> | Awaitable<Account | null | undefined>;
    linkAccount = async (account: Account): Promise<Account | null | undefined> => {
        const body = JSON.stringify(account);
        const resp = await this.secFetch(this.accounts(), { method: 'POST', body })
        await ensureOK(resp, `posting account ${body}`);
        return await resp.json()
    }

    // unlinkAccount?: ((providerAccountId: Pick<Account, "provider" | "providerAccountId">) => Promise<void> | Awaitable<Account | undefined>) | undefined;
    unlinkAccount = async (providerAccountId: Pick<Account, "provider" | "providerAccountId">): Promise<void> => {
        const resp = await this.secFetch(this.accounts(`?${makeFilter(providerAccountId)}`), { method: 'DELETE' })
        await ensureOK(resp, `deleting account ${JSON.stringify(providerAccountId)}`)
    }

    // createSession: (session: { sessionToken: string; userId: string; expires: Date; }) => Awaitable<AdapterSession>;
    createSession = async (session: { sessionToken: string; userId: string; expires: Date; }): Promise<AdapterSession> => {
        const str = JSON.stringify(session);
        const resp = await this.secFetch(this.sessions(), { method: 'POST', body: str })
        await ensureOK(resp, `posting session ${JSON.stringify(session)}`);
        return sessionFromJson(await resp.json())
    }

    // getSessionAndUser: (sessionToken: string) => Awaitable<{ session: AdapterSession; user: AdapterUser; } | null>;
    getSessionAndUser = async (sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser; } | null> => {
        const session = await firstElementOrNull(await this.secFetch(this.sessions(`?.sessionToken=${sessionToken}`)))
        if (!session) { return null }
        const rUser = await this.secFetch(`${this.users()}/${session.userId}`)
        await ensureOK(rUser, `fetching user ${session.userId}`)
        return { session: sessionFromJson(session), user: userFromJson(await rUser.json()) }
    }

    // updateSession: (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) => Awaitable<AdapterSession | null | undefined>;
    updateSession = async (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> => {
        // TODO: use PATCH
        const dbSession = await firstElementOrNull(await this.secFetch(this.sessions(`?.sessionToken=${session.sessionToken}`)))
        if (!dbSession) { return null }
        Object.keys(session).forEach(key => dbSession[key] = (session as Record<string, any>)[key])
        const body = JSON.stringify(dbSession)
        const put = await this.secFetch(this.sessions(`/${dbSession.id}`), { method: 'PUT', body })
        await ensureOK(put, `writing user ${body}`)
        return dbSession
    }

    // deleteSession: (sessionToken: string) => Promise<void> | Awaitable<AdapterSession | null | undefined>;
    deleteSession = async (sessionToken: string): Promise<void> => {
        const get = await this.secFetch(this.sessions(`?${makeFilter({ sessionToken })}`), { method: 'DELETE' })
        await ensureOK(get, `getting session with token ${sessionToken}`)
    }

    // createVerificationToken?: ((verificationToken: VerificationToken) => Awaitable<VerificationToken | null | undefined>) | undefined;
    createVerificationToken = async (verificationToken: VerificationToken): Promise<VerificationToken | null | undefined> => {
        const str = JSON.stringify(verificationToken);
        const resp = await this.secFetch(this.tokens(), { method: 'POST', body: str });
        await ensureOK(resp, `posting token ${str}`)
        const token = await resp.json()
        return { identifier: token.identifier, token: token.token, expires: new Date(token.expires) }
    }

    // useVerificationToken?: ((params: { identifier: string; token: string; }) => Awaitable<VerificationToken | null>) | undefined;
    useVerificationToken = async (params: { identifier: string; token: string; }): Promise<VerificationToken | null> => {
        const token = await firstElementOrNull(await this.secFetch(this.tokens(`?${makeFilter(params)}`)))
        if (!token) { return null }
        await this.secFetch(this.tokens(`/${token.id}`), { method: 'DELETE' })
        return { identifier: token.identifier, token: token.token, expires: new Date(token.expires) }
    }

    async deleteEverything() {
        await this.secFetch(this.sessions('?all=true'), { method: 'DELETE' })
        await this.secFetch(this.accounts('?all=true'), { method: 'DELETE' })
        await this.secFetch(this.users('?all=true'), { method: 'DELETE' })
        await this.secFetch(this.tokens('?all=true'), { method: 'DELETE' })
    }
}

function userFromJson(user: any): AdapterUser {
    return user ? { ...user, emailVerified: new Date(user.emailVerified) } : null
}

async function ensureOK(resp: Response, during: string) {
    if (!resp.ok) {
        const msg = `Error ${resp.status} during ${during}: ${await resp.text()}`;
        console.error(msg);
        throw msg;
    }
}

async function firstElementOrNull(resp: Response) {
    if (!resp.ok) { return null }
    const j = await resp.json()
    if (!Array.isArray(j) || j.length < 1) { return null }
    return j[0]
}

function sessionFromJson(session: any): AdapterSession {
    return { ...session, expires: new Date(session.expires), id: session.id ?? 'impossible: fetched CSession has null ID' }
}

function makeFilter(propertyValues: Record<string, any>) {
    let filters = Object.entries(propertyValues).map(e => `.${e[0]}=${e[1]}`)
    return filters.join('&')
}