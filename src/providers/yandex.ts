import {OAuth2Provider} from "../types";

export interface YandexProviderOptions {
  clientId: string;
  clientSecret: string;
}

const YandexProviderFactory: OAuth2Provider<YandexProviderOptions> = (options) => {
  return {
    id: 'yandex',
    name: 'Yandex',
    type: 'oauth',
    version: '2.0',
    scope: 'login:email login:info',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://oauth.yandex.ru/token',
    requestTokenUrl: 'https://oauth.yandex.ru/token',
    authorizationUrl: 'https://oauth.yandex.ru/authorize?response_type=code',
    profileUrl: 'https://login.yandex.ru/info?format=json',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.real_name,
        email: profile.default_email,
      }
    },
    ...options
  }
}

export default YandexProviderFactory;