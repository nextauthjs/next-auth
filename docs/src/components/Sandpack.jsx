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
  globalStyle,
  sessionProviderCode,
  // tsConfig,
  // indexJsx,
  // publicHtml,
} from "./sandpackCode.js"

export const CustomSandpack = () => (
  <SandpackProvider
    customSetup={{
      dependencies: {
        react: "17.0.2",
        "react-dom": "17.0.2",
        next: "^12.0.11-canary.4",
        "next-auth": "latest",
      },
      devDependencies: {
        // "@types/node": "^17.0.14",
        // "@types/react": "^17.0.39",
        // typescript: "^4.5.5",
      },
      entry: "/pages/index.js",
      environment: "next",
      files: {
        // "/public/index.html": {
        //   code: publicHtml,
        // },
        // "/index.jsx": {
        //   code: indexJsx,
        // },
        // "tsconfig.json": {
        //   code: tsConfig,
        // },
        "/pages/styles.css": {
          code: globalStyle,
          hidden: true,
        },
        "/pages/_app.jsx": {
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
        "/components/header.jsx": {
          code: headerCode,
          hidden: true,
        },
        "/components/layout.jsx": {
          code: layoutCode,
          hidden: true,
        },
        "/pages/index.jsx": {
          code: indexCode,
        },
      },
    }}
  >
    <SandpackLayout theme="sandpack-dark">
      <SandpackCodeEditor
        showLineNumbers={true}
        showTabs={true}
        showRunButton={true}
        customStyle={{ height: "900px" }}
      />
      <SandpackPreview
        showNavigator={true}
        showRefreshButton={true}
        showOpenInCodeSandbox={false}
        showSandpackErrorOverlay={true}
        customStyle={{ height: "900px" }}
      />
    </SandpackLayout>
  </SandpackProvider>
)
