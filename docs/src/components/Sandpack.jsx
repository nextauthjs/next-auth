import React from "react"
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react"

import {
  nextAuthCode,
  indexCode,
  layoutCode,
  headerCode,
  headerCss,
  sessionProviderCode,
} from "./sandpackCode.js"

export const CustomSandpack = () => (
  <SandpackProvider
    template="react-ts"
    customSetup={{
      dependencies: {
        react: "17.0.2",
        "react-dom": "17.0.2",
        next: "^12.0.11-canary.4",
        "next-auth": "latest",
      },
      devDependencies: {
        "@types/node": "^17.0.14",
        "@types/react": "^17.0.39",
        typescript: "^4.5.5",
      },
      // entry: "/pages/index.tsx",
      environment: "next",
      files: {
        "/pages/_app.tsx": {
          code: sessionProviderCode,
          hidden: true,
        },
        "/pages/api/auth/[...nextauth].js": {
          code: nextAuthCode,
          active: true,
        },
        "/components/header.module.css": {
          code: headerCss,
          hidden: true,
        },
        "/components/header.tsx": {
          code: headerCode,
          hidden: true,
        },
        "/components/layout.tsx": {
          code: layoutCode,
          hidden: true,
        },
        "/pages/index.tsx": {
          code: indexCode,
        },
      },
    }}
  >
    <SandpackLayout theme="sandpack-dark">
      <SandpackCodeEditor showLineNumbers={true} showTabs={true} />
      <SandpackPreview showNavigator={true} />
    </SandpackLayout>
  </SandpackProvider>
)
