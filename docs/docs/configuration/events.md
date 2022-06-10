---
id: events
title: Events
---

Events are asynchronous functions that do not return a response, they are useful for audit logs / reporting or handling any other side-effects.

You can specify a handler for any of these events below, for debugging or for an audit log.

:::note
The execution of your authentication API will be blocked by an `await` on your event handler. If your event handler starts any burdensome work it should not block its own promise on that work.
:::

## Events

### signIn

Sent on a successful sign in.

The message will be an object and contain:

- `user` (from your adapter or from the provider if a `credentials` type provider)
- `account` (from your adapter or the provider)
- `profile` (from the provider, is `undefined` on `credentials` provider, use `user` instead)
- `isNewUser` (whether your adapter had a user for this account already)

### signOut

Sent when the user signs out.

The message object will contain one of these depending on if you use JWT or database persisted sessions:

- `token`: The JWT token for this session.
- `session`: The session object from your adapter that is being ended

### createUser

Sent when the adapter is told to create a new user.

The message object will contain the user.

### updateUser

Sent when the adapter is told to update an existing user. Currently, this is only sent when the user verifies their email address.

The message object will contain the user.

### linkAccount

Sent when an account in a given provider is linked to a user in our user database. For example, when a user signs up with Twitter or when an existing user links their Google account.

The message object will contain:

- `user`: The user object from your adapter.
- `account`: The object returned from the provider.

### session

Sent at the end of a request for the current session.

The message object will contain one of these depending on if you use JWT or database persisted sessions:

- `token`: The JWT token for this session.
- `session`: The session object from your adapter.
