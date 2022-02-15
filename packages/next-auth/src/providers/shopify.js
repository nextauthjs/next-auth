export default function Shopify(options) {
  const { shop, scope, apiVersion = "2022-01" } = options

  return {
    id: "shopify",
    name: "Shopify",
    type: "oauth",
    authorization: {
      url: `https://${shop}.myshopify.com/admin/oauth/authorize`,
      params: {
        scope,
      },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: `https://${shop}.myshopify.com/admin/oauth/access_token`,
    userinfo: {
      request: async ({ tokens }) => {
        const { access_token = "" } = tokens
        if (!access_token) throw new Error("Access token is missing")
        const res = await fetch(
          `https://${shop}.myshopify.com/admin/api/${apiVersion}/shop.json`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": access_token,
            },
          }
        )
        if (res.ok) {
          const result = await res.json()
          return result
        }

        throw new Error("Something went wrong while trying to access your shop")
      },
    },
    profile: (profile) => {
      return {
        id: profile.shop.id,
        name: profile.shop.name,
        email: null,
        image: null,
      }
    },
    options,
  }
}
