> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/examples/express). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank">
   <img height="64" src="https://authjs.dev/img/logo/logo-sm.png" />
   </a>
   <a href="https://kit.svelte.dev" target="_blank">
   <img height="64" src="https://i.cloudup.com/zfY6lL7eFa-3000x3000.png" />
   </a>
   <h3 align="center"><b>Express Auth</b> - Example App</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://npm.im/@auth/express">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/express?color=green&label=@auth/express&style=flat-square">
      </a>
      <a href="https://bundlephobia.com/result?p=@auth/express">
        <img src="https://img.shields.io/bundlephobia/minzip/@auth/express?label=size&style=flat-square" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/express">
        <img src="https://img.shields.io/npm/dm/@auth/express?label=downloads&style=flat-square" alt="Downloads" />
      </a>
      <a href="https://npm.im/@auth/express">
        <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
      </a>
   </p>
</p>

## Overview

This is the official Express Auth example for [Auth.js](https://express.authjs.dev).

## Getting started

You can easily deploy this example to [Render.com](https://render.com/) by creating a new Web Service on Render, granting access to your repository, and applying the following settings:

#### Build

```sh
pnpm install; pnpm build
```

#### Start

```sh
pnpm start
```

## Environment Variables

Once deployed, kindly ensure you set all [required environment variables](https://authjs.dev/getting-started/deployment#environment-variables) in the `Environment` section of your Render service.

## Node.js Compatibility

The minimum version of Node.js required to run this example is Node.js v17.6.0, which includes support for Fetch API and Web Crypto API through the `--experimental-fetch` and `--experimental-webcrypto` flags, respectively.

These Node.js APIs are required by the `auth/core` package.

If you are using a version of Node.js for which both APIs are no longer experimental (i.e from v19.0.0 and above), you may remove the experimental flags from scripts in your `package.json`.

If you are using a version of Node.js that does not support any flags, you may use polyfills for the Fetch and Web Crypto APIs.
