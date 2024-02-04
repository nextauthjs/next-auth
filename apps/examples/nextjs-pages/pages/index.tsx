import CustomLink from "@/components/custom-link"

export default function Index() {
  return (
    <div className="mx-auto mt-10 space-y-4 max-w-screen-md">
      <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
      <p className="leading-loose">
        This is an example site to demonstrate how to use{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js v5</CustomLink>{" "}
        for authentication with Next.js and the{" "}
        <CustomLink href="https://nextjs.org/docs/pages">
          Pages Router
        </CustomLink>
        . Check out the{" "}
        <CustomLink href="/server-example" className="underline">
          Server
        </CustomLink>{" "}
        and the{" "}
        <CustomLink href="/client-example" className="underline">
          Client
        </CustomLink>{" "}
        examples to see how to secure pages and get session data.
      </p>
    </div>
  )
}
