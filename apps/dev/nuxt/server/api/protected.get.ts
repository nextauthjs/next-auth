const { getServerSession } = auth()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) return null

  return {
    message: "Protected data",
  }
})
