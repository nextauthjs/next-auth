import { type Session } from "@auth/fastify"

declare module "fastify" {
  interface FastifyReply {
    session: Session | null
  }
}
