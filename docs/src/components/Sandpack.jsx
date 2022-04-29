import React from "react"
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react"

export const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
)
