# with-prisma
This is an example of using the next-auth package together with [Prisma](https://prisma.io). It's currently set up with only a Google provider but you can change that to whatever you wish.

## Getting started
1. `cd` into this directory
2. `cp .env.local .env`
3. Fill in your [Google secrets](https://console.developers.google.com/apis/credentials)
4. `npm install`
5. `npm run generate`
6. `npm run db:up`
7. `npm run dev`  