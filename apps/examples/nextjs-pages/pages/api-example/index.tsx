import CustomLink from "@/components/custom-link"
import { useEffect, useState } from "react"

export default function Page() {
  const [data, setData] = useState()
  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/protected")
      const json = await res.json()
      console.log("protected.json", data)
      setData(json)
    })()
  }, [])
  return (
    <div className="mx-auto mt-10 max-w-screen-md space-y-4">
      <h1 className="text-3xl font-bold">Route Handler Usage</h1>
      <p className="leading-loose">
        This page fetches data from an API{" "}
        <CustomLink href="https://nextjs.org/docs/pages/building-your-application/routing/api-routes">
          Route
        </CustomLink>
        . The API is protected using the universal{" "}
        <CustomLink href="https://nextjs.authjs.dev#auth">
          <code>auth()</code>
        </CustomLink>{" "}
        method.
      </p>
      <h2 className="text-xl font-bold">Data from API Route:</h2>
      {data ? (
        <pre className="w-full space-y-2 overflow-auto rounded-md bg-gray-100 p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ) : (
        <p className="w-full space-y-2 overflow-auto rounded-md bg-gray-100 p-4">
          No data from API Route, please <b>Sign In</b> first.
        </p>
      )}
    </div>
  )
}
