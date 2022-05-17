/** @file
 * Unit tests for the ChiselStrike adapter for NextAuth.js.  To run, first create a .env file
 * with the following contents:
 * 
 * { "CHISELD_AUTH_SECRET" : "1234" }
 * 
 * Start `chiseld` in the directory of that .env file, then run `jest` here in this directory.
 */

import fetch from "cross-fetch"
import { Account } from "next-auth"
import { ChiselStrikeAdapter } from "../src"
export { }

const a = new ChiselStrikeAdapter('http://localhost:8080', '1234')

beforeEach(async () => {
    await a.deleteEverything()
})

test('createUser returns payload', async () => {
    const uMinimal = await a.createUser({ emailVerified: '2022-03-01' })
    expect(uMinimal).not.toBeNull()
    expect(uMinimal?.emailVerified).toStrictEqual(new Date('2022-03-01'))

    const u2 = await a.createUser({ emailVerified: '2022-03-02', name: 'Bono', email: 'a@b.co', image: '' })
    expect(u2).not.toBeNull()
    expect(u2?.emailVerified).toStrictEqual(new Date('2022-03-02'))
    expect(u2?.name).toBe('Bono')
    expect(u2?.email).toBe('a@b.co')
    expect(u2?.image).toBe('')
})

test('getUser gets the right user', async () => {
    const created = await a.createUser({ emailVerified: '2022-03-01', name: 'Johnny' })
    expect(created).not.toBeNull()
    if (!created) return
    const obtained = await a.getUser(created.id)
    expect(obtained).toStrictEqual(created)
})

test('getUser returns null for non-existent ID', async () => {
    expect(await a.getUser('never-going-to-exist-because-this-is-just-a-test')).toBeNull()
})

test('getUserByEmail gets the right user', async () => {
    const email = 'dejan@chiselstrike.com'
    const u1 = await a.createUser({ emailVerified: '2022-03-03', email, name: 'Heimdall' })
    expect(u1).not.toBeNull()
    const u2 = await a.createUser({ emailVerified: '2022-03-03', email: '', name: 'Heimdall' });
    expect(u2).not.toBeNull()
    expect(await a.getUserByEmail(email)).toStrictEqual(u1)
    expect(await a.getUserByEmail('')).toStrictEqual(u2)
})

test('getUserByEmail returns null for non-existing email', async () => {
    expect(await a.getUserByEmail('some absolutely non-existing email')).toBeNull()
})

test('updateUser updates correctly', async () => {
    const id = (await a.createUser({ emailVerified: '2022-03-03', name: 'Popeye' }))?.id
    const res = await a.updateUser({ id, name: 'Bluto', image: 'jpg' })
    expect(res).toStrictEqual({ name: 'Bluto', image: 'jpg', emailVerified: new Date('2022-03-03'), id })
    if (!id) { return }
    const get = await a.getUser(id)
    expect(get).toStrictEqual(res)
})

test('updateUser rejects non-existing id', async () => {
    await expect(a.updateUser({ id: 'something completely unexpected and unique', email: 'rhododendron' })).rejects.toMatch('completely unexpected')
})

test('linkAccount results in getUserByAccount finding the right account', async () => {
    const ghUser = await a.createUser({ emailVerified: '2022-03-03', name: 'GHUser' })
    await a.linkAccount({ provider: 'github', providerAccountId: '1234', userId: ghUser.id, type: 'oauth' })
    const twUser = await a.createUser({ emailVerified: '2022-03-03', name: 'TwUser' })
    await a.linkAccount({ provider: 'twitter', providerAccountId: '4321', userId: twUser.id, type: 'oauth' })
    expect(await a.getUserByAccount({ provider: 'github', providerAccountId: '1234' })).toStrictEqual(ghUser)
    expect(await a.getUserByAccount({ provider: 'twitter', providerAccountId: '4321' })).toStrictEqual(twUser)
})

test('getUserByAccount returns null on mismatch', async () => {
    expect(await a.getUserByAccount({ providerAccountId: 'impossible to exist', provider: 'fffff' })).toBeNull()
})

test('user deletion works', async () => {
    const u = await a.createUser({ emailVerified: '2022-03-04', name: 'Tinker Bell' })
    expect(await a.getUser(u.id)).toStrictEqual(u)
    expect(await a.deleteUser(u.id)).toBeNull()
    expect(await a.getUser(u.id)).toBeNull()
})

test('unlinkAccount makes getUserByAccount not find the account (but getUser still finds the user)', async () => {
    const u = await a.createUser({ emailVerified: '2022-03-03', name: 'Popeye' })
    const acct = { provider: 'github', providerAccountId: '1234', userId: u.id, type: 'oauth' } as Account
    await a.linkAccount(acct)
    expect(await a.getUserByAccount({ provider: 'github', providerAccountId: '1234' })).toStrictEqual(u)
    await a.unlinkAccount(acct)
    expect(await a.getUserByAccount({ provider: 'github', providerAccountId: '1234' })).toBeNull()
    expect(await a.getUser(u.id)).toStrictEqual(u)
})

test('createSession makes getSessionAndUser find the created session', async () => {
    const user = await a.createUser({ emailVerified: '2022-03-07', name: 'Oscar' })
    await a.createSession({ sessionToken: 'dummy', expires: new Date, userId: user.id })
    const session = await a.createSession({ sessionToken: 'token1', expires: new Date, userId: user.id })
    expect(await a.getSessionAndUser('token1')).toStrictEqual({ user, session })
})

test('updateSession updates correctly', async () => {
    const user = await a.createUser({ emailVerified: '2022-03-07', name: 'Oscar' })
    const s1 = await a.createSession({ sessionToken: 's1', expires: new Date, userId: user.id })
    const s2 = await a.createSession({ sessionToken: 's2', expires: new Date(10000), userId: user.id })
    await a.updateSession({ sessionToken: 's2', expires: new Date(50000) })
    expect(await a.getSessionAndUser('s2')).toStrictEqual({ user, session: { ...s2, expires: new Date(50000) } })
    expect(await a.getSessionAndUser('s1')).toStrictEqual({ user, session: s1 })
})

test('deleteSession deletes the right session', async () => {
    const user = await a.createUser({ emailVerified: '2022-03-07', name: 'Oscar' })
    const s1 = await a.createSession({ sessionToken: 's1', expires: new Date, userId: user.id })
    const s2 = await a.createSession({ sessionToken: 's2', expires: new Date, userId: user.id })
    await a.deleteSession('s1')
    expect(await a.getSessionAndUser('s1')).toBeNull()
    expect(await a.getSessionAndUser('s2')).toStrictEqual({ user, session: s2 })
})

test('useVerificationToken finds token, deletes it', async () => {
    const user = await a.createUser({ emailVerified: '2022-03-07', name: 'Oscar' })
    await a.createVerificationToken({ expires: new Date('2022-03-10'), identifier: '321', token: 'dummy' })
    const token = await a.createVerificationToken({ expires: new Date('2022-03-10'), identifier: '123', token: 'abc' })
    expect(await a.useVerificationToken({ identifier: '123', token: 'abc' })).toStrictEqual(token)
    expect(await a.useVerificationToken({ identifier: '123', token: 'abc' })).toBeNull()
})
