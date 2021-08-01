/**
 * Adds `signinUrl` and `callbackUrl` to each provider.
 * @param {{
 *  providers: import("types/providers").Provider[]
 *  baseUrl: string
 *  basePath: string
 * }} options
 * @returns {import("types/internals").InternalOptions["providers"]}
 */
export default function parseProviders({ providers = [], baseUrl, basePath }) {
  return providers.map((provider) => ({
    ...provider,
    signinUrl: `${baseUrl}${basePath}/signin/${provider.id}`,
    callbackUrl: `${baseUrl}${basePath}/callback/${provider.id}`,
    profile: provider.profile ?? defaultProfile,
  }))
}

function defaultProfile(profile) {
  return {
    id: profile.sub ?? profile.id,
    name: profile.name ?? null,
    email: profile.email ?? null,
    image: profile.image ?? null,
  }
}
