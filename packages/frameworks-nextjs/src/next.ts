import { Auth } from "@auth/core"
import type { CallbacksOptions, Session } from "@auth/core/types"
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { NextAuthConfig } from "./lib"

type GetServerSessionOptions = Partial<Omit<NextAuthConfig, "callbacks">> & {
  callbacks?: Omit<NextAuthConfig["callbacks"], "session"> & {
    session?: (...args: Parameters<CallbacksOptions["session"]>) => any
  }
}

type GetServerSessionParams =
  | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
  | [NextApiRequest, NextApiResponse]
  | []

export function getServerSession(config: NextAuthConfig) {
  return async <
    O extends GetServerSessionOptions,
    R = O["callbacks"] extends { session: (...args: any[]) => infer U }
      ? U
      : Session
  >(
    ...args: GetServerSessionParams
  ): Promise<R | null> => {
    let req, res

    req = args[0]
    res = args[1]

    const host = req.headers["x-forwarded-host"] ?? req.headers["host"]
    const protocol =
      req.headers["x-forwarded-proto"] === "http" ? "http" : "https"
    const origin = `${protocol}://${host}`
    const request = new Request(`${origin}/api/auth/session`, {
      headers: req.headers,
    })
    const authResponse = await Auth(request, config)

    const { status = 200 } = authResponse
    const body = await authResponse.json()

    authResponse.headers?.forEach((v, k) => {
      if (k === "content-type") return
      res.setHeader(k, v)
    })

    if (body && typeof body !== "string" && Object.keys(body).length) {
      if (status === 200) return body as R
      throw new Error((body as any).message)
    }

    return null
  }
}
