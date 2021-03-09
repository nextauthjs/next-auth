/** Adds `signinUrl` and `callbackUrl` to each provider. */
export default function parseProviders ({ providers = [], baseUrl, basePath, locale }) {
  return providers.map((provider) => ({
    ...provider,
    signinUrl: `${baseUrl}${basePath}/signin/${provider.id}${locale ? '?locale=' + locale : ''}`,
    callbackUrl: `${baseUrl}${basePath}/callback/${provider.id}`
  }))
}
