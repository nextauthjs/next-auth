export default (_providers, baseUrl) => {
  const providers = {}

  _providers.forEach(provider => {
    const providerId = provider.id
    providers[providerId] = {
      ...provider,
      signinUrl: `${baseUrl}/signin/${providerId}`,
      callbackUrl: `${baseUrl}/callback/${providerId}`
    }
  })

  return providers
}
