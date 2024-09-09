type Details = {
  title: string
  code: string
  logo: string
  logoW: string
  example: string
}

export enum Framework {
  Next = "nextjs",
  Svelte = "sveltekit",
  // SolidStart = "solidstart",
  Express = "express",
}

export const frameworkDetails: Record<Framework, Details> = {
  [Framework.Next]: {
    title: "Next.js",
    code: codeNextJs(),
    logo: "/img/etc/nextjs.svg",
    logoW: "45",
    example: "https://next-auth-example.vercel.app/",
  },
  [Framework.Svelte]: {
    title: "SvelteKit",
    code: codeSvelte(),
    logo: "/img/etc/sveltekit.svg",
    logoW: "40",
    example: "https://sveltekit-auth-example.vercel.app/",
  },
  // [Framework.SolidStart]: {
  //   title: "SolidStart",
  //   code: codeSolid(),
  //   logo: "/img/etc/solidstart.svg",
  //   logoW: "45",
  //   example: "https://auth-solid.vercel.app/",
  // },
  [Framework.Express]: {
    title: "Express",
    code: codeExpress(),
    logo: "/img/etc/express.svg",
    logoW: "45",
    example: "https://express.vercel.app/",
  },
}

/**
 * Using functions for these to not have to have them at the top of the file and block readability...
 */
function codeNextJs() {
  return `
// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
export const { auth, handlers } = NextAuth({ providers: [ GitHub ] })
  
// middleware.ts
export { auth as middleware } from "@/auth"
  
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers`
}

function codeSvelte() {
  return `
// src/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from '@auth/sveltekit/providers/github'
  
export const { handle } = SvelteKitAuth({
  providers: [GitHub],
})
 
// src/hooks.server.ts
export { handle } from "./auth"
`
}

// function codeSolid() {
//   return `
// import { SolidAuth } from "@auth/solid-start"
// import GitHub from "@auth/solid-start/providers/github"

// export const { GET, POST } = SolidAuth({
//   providers: [
//     GitHub({
//       clientId: process.env.AUTH_GITHUB_ID,
//       clientSecret: process.env.AUTH_GITHUB_SECRET
//     })
//   ]
// })
// `;
// }

function codeExpress() {
  return `
// server.ts
import { express } from "express"
import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/express/providers/github"
 
const app = express()
 
app.use("/auth/*", ExpressAuth({ providers: [GitHub] }))
`
}
