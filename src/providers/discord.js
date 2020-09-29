export default (options) => {
    return {
        id: 'discord',
        name: 'Discord',
        type: 'oauth',
        version: '2.0',
        scope: 'identify email',
        params: { grant_type: 'authorization_code' },
        accessTokenUrl: 'https://discord.com/api/oauth2/token',
        authorizationUrl: 'https://discord.com/api/oauth2/authorize?response_type=code&prompt=none',
        profileUrl: 'https://discord.com/api/users/@me',
        profile: (profile) => {
            console.log(profile.avatar);
            if (profile.avatar === null) {
                const default_avatar_num = parseInt(profile.discriminator) % 5;
                profile.image_url = `https://cdn.discordapp.com/embed/avatars/${default_avatar_num}.png`;
            } else {
                console.log(profile.premium_type);
                const format =
                    profile.premium_type === 1 || profile.premium_type === 2 ? 'gif' : 'png';
                console.log(format);
                profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
            }
            return {
                id: profile.id,
                user_id: profile.id,
                bot: profile.bot,
                name: profile.username,
                image: profile.image_url,
                email: profile.email
            };
        },
        ...options
    };
};
