//// @ts-nocheck
import { getSession } from "@auth/fastify"
import { authConfig } from "../config/auth.config.js"
import { FastifyReply, FastifyRequest } from "fastify"

export async function authenticatedApi(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  reply.session ??= await getSession(req, authConfig)
  if (!reply.session) {
    reply.status(401).send({ message: "Not Authenticated" })
  }
}

export async function authenticatedPage(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  reply.session ??= await getSession(req, authConfig)
  if (!reply.session) {
    return reply.view("unauthenticated")
  }
}

export async function currentSession(req: FastifyRequest, reply: FastifyReply) {
  reply.session = await getSession(req, authConfig)
}
