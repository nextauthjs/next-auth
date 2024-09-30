const { fastify } = await import("./app.js")

// const address = fastify.server.address()
// const port = (typeof address === "object" && address?.port) || 3000

const port = Number(process.env.PORT) || 3000

const start = async () => {
  try {
    await fastify.listen({ port })
    fastify.log.info(`server listening on ${fastify.server.address()}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
