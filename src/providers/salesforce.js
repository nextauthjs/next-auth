export default function Salesforce(options) {
  return {
    id: "salesforce",
    name: "Salesforce",
    type: "oauth",
    authorization:
      "https://login.salesforce.com/services/oauth2/authorize?display=page",
    token: "https://login.salesforce.com/services/oauth2/token",
    userinfo: "https://login.salesforce.com/services/oauth2/userinfo",
    profile(profile) {
      return {
        id: profile.user_id,
        name: null,
        email: null,
        image: profile.picture,
      }
    },
    checks: ["none"],
    options,
  }
}
