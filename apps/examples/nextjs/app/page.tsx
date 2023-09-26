import CustomLink from "@/components/custom-link";
import packageJSON from "../package.json";

export default function Index() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">NextAuth.js Example (v5)</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <CustomLink href="https://authjs.dev">NextAuth.js</CustomLink> v5 for
        authentication. Check out the{" "}
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
        Read the v5 migration guide at our{" "}
        <CustomLink href="https://auth-docs-git-feat-nextjs-auth-authjs.vercel.app/guides/upgrade-to-v5">
          official documentation page
        </CustomLink>
        .
      </p>
      <p>
        Current <CustomLink href="https://authjs.dev">NextAuth.js</CustomLink>{" "}
        version: <em>next-auth@{packageJSON.dependencies["next-auth"]}</em>
      </p>
    </div>
  );
}
