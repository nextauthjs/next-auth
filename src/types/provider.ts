type ProviderOptions = Record<string, any>;

export type CredentialsProviderFactory = <O extends ProviderOptions = {}>(
  options: O
) => O & {
  id: 'credentials';
  name: 'Credentials';
  type: 'credentials';
}

export interface EmailProviderOptions {
  server: {
    host: string;
    port: string;
    auth: {
      user: string;
      pass: string;
    }
  }
  from: string;
}

export type EmailProviderFactory = <O extends EmailProviderOptions>(
  options: O
) => O & {
  id: "email";
  name: "Email";
  type: "email";
  maxAge: number;
  sendVerificationRequest: (
    ctx: {
      identifier: string;
      url: string;
      token: string;
      site: string;
      provider: {
        server: {
          host: string;
          port: string;
          auth: {
            user: string;
            pass: string;
          }
        };
        from: string;
      }
    }
  ) => unknown | Promise<unknown>;
};

export type OAuth2Provider<O extends ProviderOptions = {}> = (
  options: O
) => O & {
  id: string;
  name: string;
  type: 'oauth';
  version: "1.0A" | "2.0";
  scope: string;
  params?: {
    grant_type: 'authorization_code';
    client_id?: string;
    client_secret?: string;
  };
  requestTokenUrl?: string;
  accessTokenUrl: string;
  authorizationUrl: string;
  profileUrl?: string;
  idToken?: boolean;
  setGetAccessTokenAuthHeader?: boolean;
  clientSecretCallback?: ((
    options: O["clientSecret"] extends object
      ? O["clientSecret"]
      : never
  ) => Promise<string>) | false;
  profile: (profile: any) => {
    id: string;
    name: string;
    email?: string;
    image?: string;
  };
};