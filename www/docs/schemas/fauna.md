# FaunaDB

FaunaDB Schema (`@next-auth/fauna-adapter`)

## Setup

```javascript
CreateCollection({ name: 'accounts' })
CreateCollection({ name: 'sessions' })
CreateCollection({ name: 'users' })
CreateCollection({ name: 'verification_requests' })
CreateIndex({
  name: 'account_by_provider_account_id',
  source: Collection('accounts'),
  unique: true,
  terms: [
    { field: ['data', 'providerId'] },
    { field: ['data', 'providerAccountId'] },
  ],
})
CreateIndex({
  name: 'session_by_token',
  source: Collection('sessions'),
  unique: true,
  terms: [{ field: ['data', 'sessionToken'] }],
})
CreateIndex({
  name: 'user_by_email',
  source: Collection('users'),
  unique: true,
  terms: [{ field: ['data', 'email'] }],
})
CreateIndex({
  name: 'verification_request_by_token',
  source: Collection('verification_requests'),
  unique: true,
  terms: [
    { field: ['data', 'token'] }, 
    { field: ['data', 'identifier'] }
  ],
})
```

