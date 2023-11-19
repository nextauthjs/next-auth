# client

## signIn()

> **signIn**\<`P`\>(`providerId`?, `options`?, `authorizationParams`?): `Promise`\< `undefined` \| [`Response`]( https://developer.mozilla.org/en-US/docs/Web/API/Response ) \>

Client-side method to initiate a signin flow
or send the user to the signin page listing all possible providers.
Automatically adds the CSRF token to the request.

```ts
import { signIn } from "@auth/solid-start/client"
signIn()
signIn("provider") // example: signIn("github")
```

### Type parameters

▪ **P** extends `undefined` \| `RedirectableProviderType` = `undefined`

### Parameters

▪ **providerId?**: `LiteralUnion`\< `P` extends `RedirectableProviderType` ? `P` \| `BuiltInProviderType` : `BuiltInProviderType`, `string` \>

▪ **options?**: `SignInOptions`

▪ **authorizationParams?**: [`SignInAuthorizationParams`](client.md#signinauthorizationparams)

### Returns

`Promise`\< `undefined` \| [`Response`]( https://developer.mozilla.org/en-US/docs/Web/API/Response ) \>

***

## signOut()

> **signOut**(`options`?): `Promise`\< `void` \>

Signs the user out, by removing the session cookie.
Automatically adds the CSRF token to the request.

```ts
import { signOut } from "@auth/solid-start/client"
signOut()
```

### Parameters

▪ **options?**: `SignOutParams`\< `true` \>

### Returns

`Promise`\< `void` \>

***

## SignInAuthorizationParams

> **SignInAuthorizationParams**: `string` \| `string`[][] \| `Record`\< `string`, `string` \> \| [`URLSearchParams`]( https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams )

Match `inputType` of `new URLSearchParams(inputType)`
