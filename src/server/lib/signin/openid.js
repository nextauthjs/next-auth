import openidClient from '../openid/client'

export default async (provider) => {
  const client = openidClient(provider)
  // Not sure what the 2nd argument does ...
  const authUrl = await client.authenticate(provider.authenticationUrl, false)
  return authUrl
}