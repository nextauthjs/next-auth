/** @type {import(".").OAuthProvider} */
export default function Patreon(options) {
    return {
        id: 'patreon',
        name: 'Patreon',
        type: 'oauth',
        version: '2.0',
        authorization: { 
          url : 'https://www.patreon.com/oauth2/authorize',
          params: { scope: 'identity identity[email] identity.memberships' }
        },
        token : {
          url : 'https://www.patreon.com/api/oauth2/token',
        },
        userinfo : {
          url: 'https://www.patreon.com/api/oauth2/api/current_user'
        },      
        profile: (profile) => {
          return {
            id: profile.data.id,
            name: profile.data.attributes.full_name,
            email: profile.data.attributes.email
          }
        },
        options
      }
  }