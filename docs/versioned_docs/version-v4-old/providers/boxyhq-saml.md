---
id: boxyhq-saml
title: BoxyHQ SAML
---

## Documentation

BoxyHQ SAML is an open source service that handles the SAML login flow as an OAuth 2.0 flow, abstracting away all the complexities of the SAML protocol.

You can deploy BoxyHQ SAML as a separate service or embed it into your app using our NPM library. [Check out the documentation for more details](https://boxyhq.com/docs/jackson/deploy)

## Configuration

SAML login requires a configuration for every tenant of yours. One common method is to use the domain for an email address to figure out which tenant they belong to. You can also use a unique tenant ID (string) from your backend for this, typically some kind of account or organization ID.

Check out the [documentation](https://boxyhq.com/docs/jackson/saml-flow#2-saml-config-api) for more details.

## Options

The **BoxyHQ SAML Provider** comes with a set of default options:

- [BoxyHQ Provider options](https://github.com/nextauthjs/next-auth/tree/main/packages/next-auth/src/providers/boxyhq-saml.ts)

You can override any of the options to suit your own use case.

## Example

```ts
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml"
...
providers: [
  BoxyHQSAMLProvider({
    issuer: "http://localhost:5225",
    clientId: "dummy", // The dummy here is necessary since we'll pass tenant and product custom attributes in the client code
    clientSecret: "dummy", // The dummy here is necessary since we'll pass tenant and product custom attributes in the client code
  })
}
...
```

On the client side you'll need to pass additional parameters `tenant` and `product` to the `signIn` function. This will allow BoxyHQL SAML to figure out the right SAML configuration and take your user to the right SAML Identity Provider to sign them in.

```tsx
import { signIn } from "next-auth/react";
...

  // Map your users's email to a tenant and product
  const tenant = email.split("@")[1];
  const product = 'my_awesome_product';
...
  <Button
    onClick={async (event) => {
      event.preventDefault();

      signIn("boxyhq-saml", {}, { tenant, product });
    }}>
...
```
