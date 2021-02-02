/** Adds `signinUrl` and `callbackUrl` to each provider. */
export default function parseProviders ({ providers = [], baseUrl, basePath }) {
  return providers.map((provider) => ({
    ...provider,
    signinUrl: `${baseUrl}${basePath}/signin/${provider.id}`,
    callbackUrl: `${baseUrl}${basePath}/callback/${provider.id}`
  }))
}
