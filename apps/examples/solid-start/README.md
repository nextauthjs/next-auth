> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/examples/solid-start). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank">
   <img height="64" src="https://authjs.dev/img/logo-sm.png" />
   </a>
   <a href="https://start.solidjs.com" target="_blank">
   <img height="64" src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/docs/public/img/etc/solidstart.svg" />
   </a>
   <h3 align="center"><b>SolidStart Auth</b> - Example App</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://npm.im/@auth/solid-start">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/solid-start?color=green&label=@auth/solid-start&style=flat-square">
      </a>
      <a href="https://bundlephobia.com/result?p=@auth/solid-start">
        <img src="https://img.shields.io/bundlephobia/minzip/@auth/solid-start?label=size&style=flat-square" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/solid-start">
        <img src="https://img.shields.io/npm/dm/@auth/solid-start?label=downloads&style=flat-square" alt="Downloads" />
      </a>
      <a href="https://npm.im/@auth/solid-start">
        <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
      </a>
   </p>
</p>

## Overview

This is the official SolidStart Auth example for [Auth.js](https://authjs.dev).

## Getting started

You can follow the guide below, or click the following button to deploy this example to [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=solid-start-auth-example).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/nextauthjs/solid-start-auth-example&project-name=solid-start-auth-example&repository-name=solid-start-auth-example)

### Installing

```sh
pnpm add -D solid-start-vercel
```

```sh
npm i -D solid-start-vercel
```

```sh
yarn add -D solid-start-vercel
```

### Adding to Vite config

```ts
import solid from "solid-start/vite"
import dotenv from "dotenv"
import { defineConfig } from "vite"
// @ts-expect-error no typing
import vercel from "solid-start-vercel"

export default defineConfig(() => {
  dotenv.config()
  return {
    plugins: [solid({ ssr: true, adapter: vercel({ edge: false }) })],
  }
})
```

### Environment Variables

- `ENABLE_VC_BUILD`=`1` .

### Finishing up

Create a GitHub repo and push the code to it, then deploy it to Vercel.

## Acknowledgements

<a href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss">
<img width="170px" src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/docs/public/img/etc/powered-by-vercel.svg" alt="Powered By Vercel" />
</a>
<p align="left">Thanks to Vercel sponsoring this project by allowing it to be deployed for free for the entire Auth.js Team</p>
