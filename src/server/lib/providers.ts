export default (_providers, baseUrl, basePath) => {
  const providers = {}

  _providers.forEach(provider => {
    const providerId = provider.id
    providers[providerId] = {
      ...provider,
      signinUrl: `${baseUrl}${basePath}/signin/${providerId}`,
      callbackUrl: `${baseUrl}${basePath}/callback/${providerId}`
    }
  })

  return providers
}
