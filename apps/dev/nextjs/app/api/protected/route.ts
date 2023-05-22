import { auth } from "auth"
import { NextResponse } from "next/server"
import type { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module"

export const GET: AppRouteHandlerFn = auth(function GET(req) {
  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
