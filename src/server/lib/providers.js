import baseUrl from '../../lib/baseUrl'

export default function parseProviders (providers) {
  return providers.reduce((acc, provider) => {
    const providerId = provider.id
    acc[providerId] = {
      ...provider,
      signinUrl: `${baseUrl()}/signin/${providerId}`,
      callbackUrl: `${baseUrl()}/callback/${providerId}`
    }
    return acc
  }, {})
}
