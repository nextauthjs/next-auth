import Fastify from "fastify"

import * as path from "node:path"
import {
  errorHandler,
  errorNotFoundHandler,
} from "./middleware/error.middleware.js"
import {
  authenticatedApi,
  authenticatedPage,
  currentSession,
} from "./middleware/auth.middleware.js"

import { FastifyAuth } from "@auth/fastify"
import { authConfig } from "./config/auth.config.js"

import * as pug from "pug"
import fastifyView from "@fastify/view"
import fastifyStatic from "@fastify/static"

// Trust Proxy for Proxies (Heroku, Render.com, Docker behind Nginx, etc)
export const fastify = Fastify({ trustProxy: true, logger: true })

// Decorating the reply is not required but will optimise performance
// Only decorate the reply with a value type like null, as reference types like objects are shared among all requests, creating a security risk.
fastify.decorateReply("session", null)

fastify.register(fastifyView, {
  engine: {
    pug,
  },
  root: path.join(import.meta.dirname, "..", "views"),
})

// Serve static files
// NB: Uncomment this out if you want Fastify to serve static files for you vs. using a
// hosting provider which does so for you (for example through a CDN).
fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "..", "public"),
})

// Set session in reply
fastify.addHook("preHandler", currentSession)

// Set up FastifyAuth to handle authentication
// IMPORTANT: It is highly encouraged set up rate limiting on this route
fastify.register(FastifyAuth(authConfig), { prefix: "/api/auth" })

// Routes
fastify.get(
  "/protected",
  { preHandler: [authenticatedPage] },
  async (req, reply) => {
    return reply.view("protected", { session: reply.session })
  }
)

fastify.get(
  "/api/protected",
  { preHandler: [authenticatedApi] },
  async (req, reply) => {
    return reply.send(reply.session)
  }
)

fastify.get("/", async (_req, reply) => {
  return reply.view("index", {
    title: "Fastify Auth Example",
    user: reply.session?.user,
  })
})

fastify.get("/2", async (_req, reply) => {
  return reply.view("index", {
    title: "Fastify Auth Example",
    user: reply.session?.user,
  })
})

fastify.setErrorHandler(errorHandler)
fastify.setNotFoundHandler(errorNotFoundHandler)
