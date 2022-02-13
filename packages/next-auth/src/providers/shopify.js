export default function Shopify(options) {
  const {
    shop = "",
    scope = "",
    clientId = "",
    clientSecret = "",
    apiVersion = "",
  } = options

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
    token: {
      request: async (context) => {
        if (!context.params.code)
          throw new Error("No code returned by shopify server")
        const payload = JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: context.params.code,
        })
        const res = await fetch(
          `https://${shop}.myshopify.com/admin/oauth/access_token`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: payload,
          }
        )
        if (res.ok) {
          const result = await res.json()
          return { tokens: result }
        }

        throw new Error(
          "Something went wrong while trying to get the access_token"
        )
      },
    },
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
      }
    },
    ...options,
  }
}
