"use client"
import CustomLink from "@/components/custom-link"
import { useEffect, useState } from "react"

export default function Page() {
  const [data, setData] = useState()
  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/protected")
      const json = await res.json()
      setData(json)
    })()
  }, [])
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Route Handler Usage</h1>
      <p>
        This page fetches data from an API{" "}
        <CustomLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
          Route Handler
        </CustomLink>
        . The API is protected using the universal{" "}
        <CustomLink href="https://nextjs.authjs.dev#auth">
          <code>auth()</code>
        </CustomLink>{" "}
        method.
      </p>
      <h2 className="text-xl font-bold">Data from API Route:</h2>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}
