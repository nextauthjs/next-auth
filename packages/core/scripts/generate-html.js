import { renderToStaticMarkup } from "preact-render-to-string"

import SignIn from "../src/lib/pages/signin.tsx"

const html = renderToStaticMarkup(
  <SignIn
    csrfToken="__csrfToken"
    providers={[]}
    callbackUrl="__callbackUrl"
    email="__email"
    error="__error"
    theme={{}}
  />
)

console.log(html)
