/* eslint-disable */
const Adapters = require('../adapters');
const assert = require('assert');
const fauna = require('faunadb');
const q = fauna.query;

const adminClient = new fauna.Client({
    secret: 'secret',
    domain: 'localhost',
    port: '8443',
    scheme: 'http'
});

// Authenticated client against the new DB used for tests
let client = null;

const InitialiseDb = async () => {
    await adminClient.query(
        q.CreateDatabase({name: 'nextauth'})
    );
    
    const key = await adminClient.query(
        q.CreateKey({
            database: q.Database('nextauth'),
            role: 'server'
        })
    );

    client = new fauna.Client({
        secret: key.secret,
        domain: 'localhost',
        port: '8443',
        scheme: 'http'
    });

    await client.query(q.CreateCollection({name: 'account'}));
    await client.query(q.CreateCollection({name: 'session'}));
    await client.query(q.CreateCollection({name: 'user'}));
    await client.query(q.CreateCollection({name: 'verification_request'}));

    await client.query(q.CreateIndex({
        name: 'account_by_provider_account_id',
        source: q.Collection('account'),
        unique: true,
        terms: [
            { field: ['data', 'providerId'] },
            { field: ['data', 'providerAccountId'] }
        ]
    }));

    await client.query(q.CreateIndex({
        name: 'session_by_token',
        source: q.Collection('session'),
        unique: true,
        terms: [
            { field: ['data', 'sessionToken'] }
        ]
    }));

    await client.query(q.CreateIndex({
        name: 'user_by_email',
        source: q.Collection('user'),
        unique: true,
        terms: [
            { field: ['data', 'email'] }
        ]
    }));

    await client.query(q.CreateIndex({
        name: 'verification_request_by_token',
        source: q.Collection('verification_request'),
        unique: true,
        terms: [
            { field: ['data', 'token'] }
        ]
    }));
}

const RunTests = async (adapter) => {
    // createUser
    const newUserResult = await adapter.createUser({
        name: 'test user',
        email: 'user@name.test',
        image: 'https://www.gravatar.com/avatar/0'
    });

    assert.strictEqual(newUserResult.name, 'test user');
    assert(newUserResult.createdAt !== null);

    const userId = newUserResult.id;

    // getUser
    const user = await adapter.getUser(newUserResult.id);
    assert.strictEqual(user.id, userId);

    // getUserByEmail
    const userByEmaiil = await adapter.getUserByEmail('user@name.test');
    assert.strictEqual(userByEmaiil.id, userId);

    // updateUser
    const update = {
        ...user,
        name: 'updated name'
    };
    const updatedUser = await adapter.updateUser(update);
    assert.strictEqual(updatedUser.name, 'updated name');
    assert.strictEqual(updatedUser.id, userId);

    // linkAccount
    const account = await adapter.linkAccount(
        userId,
        'github',
        'oauth',
        756832,
        undefined,
        'b7e3b00f2c596abc445f11abc445f1104c1b2b',
        null
    );
    assert.strictEqual(account.userId, userId);
    assert.strictEqual(account.providerId, 'github');
    assert(account.createdAt !== null);

    // getUserByProviderAccountId
    const userByProviderAccountId = await adapter.getUserByProviderAccountId('github', 756832);
    assert.strictEqual(userByProviderAccountId.email, user.email);

    // createSession
    const newSession = await adapter.createSession(user);
    assert(newSession.sessionToken !== null);
    assert(newSession.createdAt !== null);
    assert(newSession.expires !== null);

    // getSession
    const session = await adapter.getSession(newSession.sessionToken);
    assert.strictEqual(session.sessionToken, newSession.sessionToken);

    // updateSession
    const updatedSession = await adapter.updateSession(session);
    assert(updatedSession.expires !== session.expires);

    // deleteSession
    await adapter.deleteSession(session.sessionToken);

    // unlinkAccount
    await adapter.unlinkAccount(userId, 'github', 756832);

    // deleteUser 
    await adapter.deleteUser(userId);

    // createVerificationRequest
    let requestSent = false;
    const newVerificationRequest = await adapter.createVerificationRequest(
        'user@test.test',
        'http://localhost/callback/email?email=test@test.test&token=123',
        '123',
        'abc',
        {
            sendVerificationRequest: ({}) => {
                requestSent = true;
            }
        }
    );
    assert.strictEqual(newVerificationRequest.identifier, 'user@test.test');
    assert(newVerificationRequest.token !== null && newVerificationRequest.token !== '');
    assert(requestSent === true);

    // getVerificationRequest
    const verificationRequest = await adapter.getVerificationRequest('user@test.test', '123', 'abc');
    assert.strictEqual(verificationRequest.identifier, 'user@test.test');
    assert.strictEqual(verificationRequest.token, newVerificationRequest.token);

    // deleteVerificationRequest
    await adapter.deleteVerificationRequest('user@test.test', '123', 'abc');
}

;(async () => {
  let error = false;

  try {
    // Initialise collections and create indexes
    await InitialiseDb();

    const adapterFactory = Adapters.Fauna.Adapter({faunaClient: client});
    const adapter = await adapterFactory.getAdapter({baseUrl: 'http://localhost'});

    await RunTests(adapter);
    console.log('FaunaDB loaded ok');
  } catch (error) {
    console.error('FaunaDB error', error);
    error = true;
  } finally {
      // Clean up the DB
      await adminClient.query(
        q.Delete(q.Database('nextauth'))
      );
  }

  const retCode = error ? 1 : 0;
  process.exit(retCode);
})();
