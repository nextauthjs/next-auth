---
title: "client"
---

# client

## Functions

### signIn()

#### Signature

```ts
signIn<P>(providerId?: LiteralUnion<P extends RedirectableProviderType ? BuiltInProviderType | P : BuiltInProviderType, string>, options?: SignInOptions, authorizationParams?: SignInAuthorizationParams): Promise<undefined | Response>
```

Client-side method to initiate a signin flow
or send the user to the signin page listing all possible providers.
Automatically adds the CSRF token to the request.

[Documentation](https://authjs.dev/reference/utilities/#signin)

#### Type parameters

- `P` *extends* `undefined` \| `RedirectableProviderType` = `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerId?` | `LiteralUnion`<`P` extends `RedirectableProviderType` ? `BuiltInProviderType` \| `P` : `BuiltInProviderType`, `string`\> |
| `options?` | `SignInOptions` |
| `authorizationParams?` | `SignInAuthorizationParams` |

#### Returns

`Promise`<`undefined` \| [Response]( https://developer.mozilla.org/en-US/docs/Web/API/Response )\>

---

### signOut()

#### Signature

```ts
signOut(options?: SignOutParams<true>): Promise<void>
```

Signs the user out, by removing the session cookie.
Automatically adds the CSRF token to the request.

[Documentation](https://authjs.dev/reference/utilities/#signout)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `SignOutParams`<`true`\> |

#### Returns

`Promise`<`void`\>
