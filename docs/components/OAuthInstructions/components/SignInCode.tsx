import { Code } from "@/components/Code";
import { Pre, Code as NXCode } from "nextra/components";
import { TSIcon } from "./TSIcon";

interface Props {
  providerName: string;
  providerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlight: any; // TODO...
}

export function SignInCode({ providerId, providerName, highlight }: Props) {
  return (
    <Code>
      <Code.Next>
        <Pre
          data-filename="./components/sign-in.tsx"
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
import { signIn } from "@/auth.ts";
// ...
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("${providerId}");
      }}
    >
      <button type="submit">Signin with ${providerName}</button>
    </form>
  );
}
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
      </Code.Next>
    </Code>
  );
}
