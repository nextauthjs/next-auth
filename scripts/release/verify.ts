export async function verify() {
  if (!process.env.NPM_TOKEN_PKG) {
    throw new Error("NPM_TOKEN_PKG is not set")
  }
  if (!process.env.NPM_TOKEN_ORG) {
    throw new Error("NPM_TOKEN_ORG is not set")
  }
  if (!process.env.RELEASE_TOKEN) {
    throw new Error("RELEASE_TOKEN is not set")
  }
}
