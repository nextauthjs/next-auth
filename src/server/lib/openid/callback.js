import openidClient from './client'

export default async (req, provider) => {
  const client = openidClient(provider)
  const { claimedIdentifier } = await client.verifyAssertion(req.url)
  const profile = await provider.mapIdentifierToProfile(claimedIdentifier)

  return {
    claimedIdentifier,
    account: {
      provider: provider.id,
      type: provider.type,
      id: profile.id
    },
    profile: {
      name: profile.name,
      email: profile.email ? profile.email.toLowerCase() : null,
      image: profile.image
    }
  }
}