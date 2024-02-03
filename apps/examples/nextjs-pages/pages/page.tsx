import CustomLink from "@/components/custom-link"

// export default function Index({ packageJSON }) {
export default function Index() {
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
      <p>
        Current{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
      </p>
    </div>
  )
  // version: <em>next-auth@{packageJSON.dependencies["next-auth"]}</em>
}

// export const getServerSideProps = async () => {
//   const packageJSON = await import("../package.json")
//   return {
//     data: packageJSON.default,
//   }
// }
