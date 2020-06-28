type JwtIO = (props: {
  secret: string;
  key: string;
  token: string;
  maxAge: number;
}) => any;

export interface Options {
  site: string;
  // TODO: assign upon reorganizing
  providers: [];
  // TODO: make adapater type
  database?: "";
  secret?: string;
  session?: {
    jwt: boolean;
    maxAge: number;
    updateAge: number;
  };
  jwt?: {
    secret: string;
    encode: JwtIO;
    decode: JwtIO;
  };
  pages?: {
    signin?: string;
    signout?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string;
  };
  callbacks?: {
    signin: (profile: any, account: any, metadata: any) => Promise<any>;
    redirect: (url: string, baseUrl: string) => Promise<any>;
    session: (session: any, token: any) => Promise<any>;
    jwt: (token: string) => Promise<any>;
  };
  events?: {
    signin: (message: string) => Promise<any>;
    signout: (message: string) => Promise<any>;
    createUser: (message: string) => Promise<any>;
    linkAccount: (message: string) => Promise<any>;
    session: (message: string) => Promise<any>;
    error: (message: string) => Promise<any>;
  };
  debug?: boolean;
  basePath?: string;
  // TODO: adapter type
  adapter?: "adapter";
  useSecureCookies?: boolean;
  cookies?: {
    sessionToken?: CookieProps;
    callbackurl?: CookieProps;
    csrfToken?: CookieProps;
  }
}

interface CookieProps {
  name: string;
  options: {
    // todo: specific string literal types
    sameSite: string;
    path: string;
    secure: boolean;
    httpOnly?: boolean;
  }
}