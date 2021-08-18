// See: https://stackoverflow.com/a/59499895/5364135
export {}

declare global {
  export namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
      NEXTAUTH_URL?: string
      VERCEL_URL?: string
    }
  }
}
