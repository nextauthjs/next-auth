export async function verify() {
  if (!process.env.NPM_TOKEN_PKG) {
    throw new Error("NPM_TOKEN_PKG is not set")
  }
  if (!process.env.NPM_TOKEN_ORG) {
    throw new Error("NPM_TOKEN_ORG is not set")
  }
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set")
  }
}
