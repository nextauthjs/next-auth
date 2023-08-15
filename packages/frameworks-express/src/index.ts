import { Auth } from "@auth/core"
import type { AuthAction, AuthConfig, Session } from "@auth/core/types"
import express, { Request, Response, NextFunction } from "express";
import { httpApiAdapters } from "./httpApiAdapters";




 function ExpressAuthHandler(authConfig: AuthConfig) {
  
  return async (req: Request, res: Response, )=> {
    const request = httpApiAdapters.request.fromExpressToFetch(req);
    const response = await Auth(request, authConfig);
    await httpApiAdapters.response.fromFetchToExpress(response, res)
  }
}

export function ExpressAuth(config: AuthConfig) :ReturnType<typeof ExpressAuthHandler>{
  const {  ...authOptions } = config
  authOptions.secret ??= process.env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )

  return ExpressAuthHandler(authOptions)
}

export type GetSessionResult = Promise<Session | null>

// export async function getSession(
//   req: Request,
//   options: AuthConfig
// ): GetSessionResult {
//   options.secret ??= process.env.AUTH_SECRET
//   options.trustHost ??= true

//   const url = new URL("/api/auth/session", req.url)
//   const response = await Auth(
//     new Request(url, { headers: req.headers }),
//     options
//   )

//   const { status = 200 } = response

//   const data = await response.json()

//   if (!data || !Object.keys(data).length) return null
//   if (status === 200) return data
//   throw new Error(data.message)
// }


// TODO: implement Express router handler

/*
export function ExpressAuth(authConfig){

return async (req, res) => {
  const request = httpApiAdapters.request.fromExpressToFetch(req);
  const response = await Auth(request, getAuthConfig(req));
  await httpApiAdapters.response.fromFetchToExpress(response, res);
  }

}

router.use("auth/....", ExpressAuth(authConfig))
*/