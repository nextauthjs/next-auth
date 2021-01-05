export default function parseProviders ({ providers, baseUrl, basePath }) {
  return providers.reduce((acc, provider) => {
    const providerId = provider.id
    acc[providerId] = {
      ...provider,
      signinUrl: `${baseUrl}${basePath}/signin/${providerId}`,
      callbackUrl: `${baseUrl}${basePath}/callback/${providerId}`
    }
    return acc
  }, {})
}
