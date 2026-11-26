import { Redis } from "@upstash/redis"
import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  // Check Authorization
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }

  // Get Upstash Redis client
  const webAuthnKV = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })

  // Drop all WebAuthn authenticators
  await webAuthnKV.flushall()

  // Verify
  const allKeys = await webAuthnKV.keys("*")

  if (!allKeys.length) {
    return NextResponse.json({ ok: true })
  } else {
    return new NextResponse("Flush Failed", {
      status: 500,
    })
  }
}
