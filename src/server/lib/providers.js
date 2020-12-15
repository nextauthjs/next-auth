import baseUrl from '../../lib/baseUrl'

export default function parseProviders (_providers) {
  const providers = {}

  _providers.forEach(provider => {
    const providerId = provider.id
    providers[providerId] = {
      ...provider,
      signinUrl: `${baseUrl()}/signin/${providerId}`,
      callbackUrl: `${baseUrl()}/callback/${providerId}`
    }
  })

  return providers
}
