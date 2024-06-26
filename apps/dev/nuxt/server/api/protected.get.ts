export default defineEventHandler(async (event) => {
  const session = await auth(event)

  if (!session) return null

  return {
    message: "Protected data",
  }
})
