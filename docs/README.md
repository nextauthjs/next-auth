<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img width="150px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>
   <h3 align="center">Auth.js</h3>
   <p align="center">Authentication for Next.js</p>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml?query=workflow%3ARelease">
        <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg" alt="Release" />
      </a>
      <a href="https://packagephobia.com/result?p=@auth/core">
        <img src="https://packagephobia.com/badge?p=@auth/core" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/core">
        <img src="https://img.shields.io/npm/dm/@auth/core" alt="Downloads" />
      </a>
      <a href="https://github.com/nextauthjs/next-auth/stargazers">
        <img src="https://img.shields.io/github/stars/nextauthjs/next-auth" alt="Github Stars" />
      </a>
      <a href="https://www.npmjs.com/package/@auth/core">
        <img src="https://img.shields.io/github/v/release/nextauthjs/next-auth?label=latest" alt="Github Stable Release" />
      </a>
   </p>
</p>

## Overview

This is the repository for the documentation page for Auth.js!

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

This documentation site is based on the [Docusaurus](https://docusaurus.io) framework.

## Getting Started

To start a local environment of this project, please do the following.

1. Clone the repo:

```sh
git clone git@github.com:nextauthjs/next-auth.git
cd next-auth
```

2. Set up the correct pnpm version, using [Corepack](https://nodejs.org/api/corepack.html). Run the following in the project'a root:

```sh
corepack enable pnpm
```

(Now, if you run `pnpm --version`, it should print the same verion as the `packageManager` property in the [`package.json` file](https://github.com/nextauthjs/next-auth/blob/main/package.json))

3. Install packages. Developing requires Node.js v18:

```sh
pnpm install
```

4. Start the development server

```bash
$ pnpm dev:docs
```

And thats all! Now you should have a local copy of this docs site running at [localhost:3000](http://localhost:3000)!

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please first read our [Contributing Guide](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md).

## License

ISC
