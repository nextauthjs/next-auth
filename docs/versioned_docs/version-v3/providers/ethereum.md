---
id: ethereum
title: Ethereum
---

## Overview

The Ethereum provider allows a user to sign in with an ethereum account. The provider implements
[EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) with the Sign-In with Ethereum (SIWE) [library](https://login.xyz).

### How it works

To sign in with an Ethereum account, a user needs an Ethereum wallet like the one provided by the
[Metamask](https://metamask.io/) browser extension.

Your app creates a Sign-In with Ethereum
[message](https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/creating-siwe-messages).
This message is passed to the wallet where the user cryptographically
[signs the message](https://medium.com/immunefi/intro-to-cryptography-and-signatures-in-ethereum-2025b6a4a33d).

The message and the associated signature are passed to the Ethereum provider. If the signature is
valid, the user is authenticated and the sign in flow proceeds.

## Users

Like the Email provider and the OAuth providers, Ethereum provider creates and accesses
users from the database if an adapter is configured. However, users created by Ethereum
provider do not have `email` populated.

## Options

In addition to the common provider options, the Ethereum provider accepts a `siweVerifyOptions` parameter.
This allows you to pass SIWE
[`VerifyOpts`](https://github.com/spruceid/siwe/blob/053f16bf7dce3ff587e00bc4d3754a29ee9c26e6/packages/siwe/lib/types.ts#L25)
to customize the signature verification behavior.

## Example

Ethereum provider can be constructed with no options:

```js title="pages/api/auth/[...nextauth].js"
import Ethereum from 'next-auth/providers/ethereum'
...
providers: [
  Ethereum(),
],
```

The provider `name` defaults to "Ethereum" and the `id` to "ethereum".

The frontend example uses [Ethers.js](https://docs.ethers.io/v5/) to interact with the user's wallet.
[Web3.js](https://web3js.readthedocs.io/en/v1.8.0/) is an alternative option.

:::tip
Various front-end libraries exist to help your app interact with a user's wallet.
[Onboard](https://onboard.blocknative.com/) and [wagmi](https://wagmi.sh/)(React) are two options.
:::


```js title="siwe.js"
import { ethers } from "ethers"
import { SiweMessage } from "siwe"

const domain = window.location.host // Should match NEXTAUTH_URL's host
const origin = window.location.origin
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

function connectWallet() {
  provider
    .send("eth_requestAccounts", [])
    .catch(() => console.log("user rejected request"))
}

async function signInWithEthereum() {
  // Create message
  const csrfResponse = await fetch("/api/auth/csrf")
  const { csrfToken } = await csrfResponse.json()
  const address = signer.getAddress()
  const message = new SiweMessage({
    address,
    chainId: "1",
    domain,
    nonce: csrfToken,
    statement: "Sign in to NextAuth with Ethereum",
    uri: origin,
    version: "1",
  })

  // Sign message
  const signature = await signer.signMessage(message)

  // Call NextAuth
  const params = new URLSearchParams()
  params.append("message", message)
  params.append("signature", signature)
  params.append("csrfToken", csrfToken)

  const response = await fetch(`/api/auth/callback/ethereum`, {
    body: params,
    method: "post",
    redirect: "follow",
  })

  if (response.status === 200 && response.redirected === true) {
    window.location.replace(response.url)
  }
}

// Buttons from the HTML page
const connectWalletButton = document.getElementById("connectWalletButton")
const siweButton = document.getElementById("siweButton")
connectWalletButton.onclick = connectWallet
siweButton.onclick = signInWithEthereum
```

```html title="siwe.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>NextAuth SIWE</title>
  </head>

  <body>
    <div><button id="connectWalletButton">Connect Wallet</button></div>
    <div><button id="siweButton">Sign-In with Ethereum</button></div>
  </body>
</html>
```

:::tip
See the Sign-In with Ethereum
["Implement the Frontend"](https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/implement-the-frontend)
documentation for more detail.
:::

### A note on `nonce`

Strictly, the `SiweMessage` nonce does not have to be the CSRF token. However,
to prevent replay attacks the SIWE documentation
[suggests](https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/implement-sessions)
that the nonce should be tied to the end user's browser session. To encourage this
good practice, the callback payload includes a `csrfToken` parameter and its value is used
as the nonce.
