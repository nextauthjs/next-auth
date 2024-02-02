import { Code } from "@/components/Code";
import { Pre, Code as NXCode } from "nextra/components";
import { TSIcon } from "./TSIcon";

interface Props {
  providerName: string;
  providerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlight: any; // TODO...
}

export function SetupCode({ providerId, providerName, highlight }: Props) {
  return (
    <Code>
      <Code.Next>
        <Pre
          data-filename="@/auth"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `
import NextAuth from "next-auth";
import ${providerName} from "next-auth/providers/${providerId}";
// ...
export const { signIn, signOut, auth } = NextAuth({
  providers: [${providerName}()],
});
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
      </Code.Next>
      <Code.Svelte>
        <Pre
          data-filename="./src/hooks.server.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `
import { SvelteKitAuth } from "@auth/sveltekit";
import ${providerName} from "@auth/sveltekit/providers/${providerId}";
// ...
export const handle = SvelteKitAuth({
  providers: [${providerName}()],
});
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
      </Code.Svelte>
      <Code.Express>
        <Pre
          data-filename="./src/routes/auth.route.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `
import { ExpressAuth } from "@auth/express";
import ${providerName} from "@auth/express/providers/${providerId}";
import express from "express";
// ...
const app = express();
// Make sure to use these body parsers so Auth.js can receive data from the client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.use("trust proxy");
app.use(
  "/api/auth/*",
  ExpressAuth({
    providers: [
      ${providerName}({
        clientId: process.env.AUTH_${providerId.toUpperCase().replace(/-/ig, "_")}_ID,
        clientSecret: process.env.AUTH_${providerId.toUpperCase().replace(/-/ig, "_")}_SECRET,
      }),
    ],
  })
);
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
      </Code.Express>
    </Code>
  );
}
