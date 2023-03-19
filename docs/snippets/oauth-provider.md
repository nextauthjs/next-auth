Add $1 login to your page.

## Example

@example

```js
import Auth from "@auth/core"
import { $1 } from "@auth/core/providers/$2"

const request = new Request("https://example.com")
const response = await AuthHandler(request, {
  providers: [$1({ clientId: "", clientSecret: "" })],
})
```

## Resources

@see [Link 1](https://example.com)

## Notes

By default, Auth.js assumes that the $1 provider is
based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.

:::tip

The $1 provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/$2.ts).
To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).

:::

:::info **Disclaimer**

If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).

Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).

:::
