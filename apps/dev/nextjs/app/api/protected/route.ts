import { withAuth } from "app/auth"
import { NextResponse } from "next/server"

export const GET = withAuth((req) => {
  // whatev
  if (req.auth) return NextResponse.json(req.auth)
})
