import CustomLink from "@/components/custom-link"
import packageJSON from "../package.json"
import { auth } from "auth"

export default async function Index() {
  const session = await auth()
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
        for authentication. Check out the{" "}
        <CustomLink href="/server-example" className="underline">
          Server
        </CustomLink>{" "}
        and the{" "}
        <CustomLink href="/client-example" className="underline">
          Client
        </CustomLink>{" "}
        examples to see how to secure pages and get session data.
      </p>
      <pre className="p-4 rounded-md bg-neutral-100 text-wrap dark:bg-neutral-800">
        {session ? JSON.stringify(session, null, 2) : "null"}
      </pre>
      <p>
        Current{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
        version: <em>next-auth@{packageJSON.dependencies["next-auth"]}</em>
      </p>
    </div>
  )
}
