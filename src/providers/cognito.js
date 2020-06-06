export default (options) => {
	const { region, subdomain } = options;
  return {
		id: 'cognito',
		name: 'Cognito',
		type: 'oauth',
		version: '2.0',
		scope: 'openid profile email',
		params: { grant_type: 'authorization_code'},
		accessTokenUrl: `https://${subdomain}.auth.${region}.amazoncognito.com/oauth2/token`,
		authorizationUrl: `https://${subdomain}.auth.${region}.amazoncognito.com/oauth2/authorize?response_type=code`,
		profileUrl: `https://${subdomain}.auth.${region}.amazoncognito.com/oauth2/userInfo`,
		profile: (profile) => {
			 return {
				id: profile.sub,
				name: profile.username,
				email: profile.email,
				image: null
			}
		},
    ...options
  }
} 