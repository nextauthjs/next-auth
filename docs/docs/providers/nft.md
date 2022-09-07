---
id: walt-id-nft
title: NFT 
---

With the NFT provider users of your application can be their own identity provider, by using NFTs as method of authentication.
The validation happens on the server and is handled by the IDP Kit of walt.id, an open-source product.
It can be configured to only check if a user holds an NFT of a specified collection or if the NFT also holds certain traits 
in order to be logged in successfully.

## Documentation

To get a better understanding of the IDP Kit, the product handling the login requests and validating the NFTs, you can
have a look at the [general documentation](https://docs.walt.id/v/idpkit/concepts/identity-provision-via-nfts). There 
you can also find information on how to fine-tune the validation mechanism used for the NFTs.

## Configuration

On provider creation you also need an `identityProviderURL` in addition to the regular `clientId` and `clientSecret`.

#### Why we need the `identityProviderURL`?
The server handling the login request and validating the NFT is based on the IDP Kit, an open-source product, which can be
self-hosted. This requires the `NFTProvider` to be flexible in regards, to which endpoint to send the login request to, as every self-hosted
instance will have a different URL. Therefore, we can provide this information via the `identityProviderURL` parameter. 
The **Example Section** shows how to use the `NFTProvider` in different environments. 


How it works under the hood:
- [NFT](https://docs.walt.id/v/idpkit/concepts/identity-provision-via-nfts) - Identity provision via NFTs

## Example

#### Development

The IDP Kit can be run locally. This will expose the API used by the `NFTProvider` under `http://localhost:8080`, by default. 
Options to overwrite the port can be found [here](https://docs.walt.id/v/idpkit/configuration-and-setup/idpkit-setup#binding-address-and-port). 

```typescript
NFTProvider(
      'clientId',
      'clientSecret',
      'http://localhost:8080' //identityProviderURL
    )
```

#### Production 

After testing the functionality locally, the IDP Kit can be hosted publicly. Let's say we choose to host it under
`https://example.com`. We can now provide this URL instead of the `localhost` one, used during development when creating 
the `NFTProvider` and pass it as value for the `identityProviderURL`.

```typescript
NFTProvider(
      'clientId',
      'clientSecret',
      'https://example.com' //identityProviderURL
    )
```

## Getting Started

https://docs.walt.id/v/idpkit/getting-started/quick-start




