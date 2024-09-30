> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/examples/fastify). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank">
   <img height="64" src="https://authjs.dev/img/logo-sm.png" />
   </a>
   <a href="https://fastify.dev/" target="_blank">
   <img height="64" src="https://github.com/fastify/graphics/raw/HEAD/fastify-landscape-outlined.svg" />
   </a>
   <h3 align="center"><b>Fastify Auth</b> - Example App</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://npm.im/@auth/fastify">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/fastify?color=green&label=@auth/fastify&style=flat-square">
      </a>
      <a href="https://bundlephobia.com/result?p=@auth/fastify">
        <img src="https://img.shields.io/bundlephobia/minzip/@auth/fastify?label=size&style=flat-square" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/fastify">
        <img src="https://img.shields.io/npm/dm/@auth/fastify?label=downloads&style=flat-square" alt="Downloads" />
      </a>
      <a href="https://npm.im/@auth/fastify">
        <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
      </a>
   </p>
</p>

## Overview

This is the official Fastify Auth example for [Auth.js](https://fastify.authjs.dev).

## Getting started

You can instantly deploy this example to [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=fastify-auth-example) by clicking the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/nextauthjs/fastify-auth-example&project-name=fastify-auth-example&repository-name=fastify-auth-example)

## Environment Variables

Once deployed, kindly ensure you set all [required environment variables](https://authjs.dev/getting-started/deployment#environment-variables) in the `Environment` section of your hosting service.

## Node.js Compatibility

The recommended version of Node.js to use in this example is Node.js v20.0.0.

If you are using a version of Node.js lower than this (for example the minimum supported node version v18.0.0), you may need to enable Web Crypto API via the `--experimental-webcrypto` flag in the `start` and `dev` scripts of your `package.json` file.

Instead of using the experimental flag, you may use the following polyfill:

```ts
// polyfill.cjs
globalThis.crypto ??= require("crypto").webcrypto
```

And then import it within a top-level file in the application:

```ts
// server.ts
import "./polyfill.cjs"
```
