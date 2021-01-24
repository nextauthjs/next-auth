import openid from 'openid'
import { promisify } from 'util'

export default (provider) => {
  const {
    callbackUrl,
    realm,
    stateless,
    strict,
    extensions
  } = provider

  const client = new openid.RelyingParty(
    callbackUrl,
    realm,
    stateless,
    strict,
    extensions
  )

  return {
    authenticate: promisify(client.authenticate).bind(client),
    verifyAssertion: promisify(client.verifyAssertion).bind(client)
  }
}