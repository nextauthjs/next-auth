// Minimum TypeScript Version: 3.8
/// <reference types="node" />
import type { ConnectionOptions } from 'typeorm';
import type { IncomingMessage, ServerResponse } from 'http';
import type { PossibleProviders } from './providers';
import Adapter from './adapters';

interface InitOptions {
  site: string;
  providers: PossibleProviders[];
  database: ConnectionOptions | string;
  secret?: string;
  jwt?: boolean;
  jwtSecret?: string;
  sessionMaxAge?: number;
  sessionUpdateAge?: number;
  verificationMaxAge?: number;
  pages?: PageOptions;
  debug?: boolean;
  basePath?: string;
  callbackUrlHandler?: (url: string, options: CallbackURLOptions) => Promise<void>;
  adapter?: Adapter;
  useSecureCookies?: boolean;
  cookies?: Cookies;
}

interface PageOptions {
  signin?: string;
  signout?: string;
  error?: string;
  verifyRequest?: string;
  newUsers?: string | null;
}

interface Cookies {
  [cookieKey: string]: Cookie;
}

interface Cookie {
  name: string;
  options: CookieOptions;
}

interface CookieOptions {
  httpOnly?: boolean;
  // TODO: type available `sameSite` identifiers
  sameSite: 'lax';
  path: string;
  secure: boolean;
}

interface CallbackURLOptions {
  site: string;
  defaultCallbackUrl?: string;
  cookies?: Cookies;
  callbacks?: Callbacks;
}

interface GenericObject {
  [key: string]: any;
}

// TODO: Improve callback typings
interface Callbacks {
  signin(profile: GenericObject, account: GenericObject, metadata: GenericObject): Promise<void>;
  redirect(url: string, baseUrl: string): Promise<string>;
  session(session: GenericObject, token: GenericObject): Promise<GenericObject>;
  jwt(token: GenericObject, oAuthProfile: GenericObject): Promise<GenericObject>;
}

declare function NextAuth(req: NextApiRequest, res: NextApiResponse, options?: InitOptions): Promise<void>;

export default NextAuth;
export type { InitOptions, PageOptions };

/**
 * TODO: `dtslint` throws when parsing Next types... the following types are copied directly from `next/types` ...
 * @see https://github.com/microsoft/dtslint/issues/297
 */

interface NextApiRequest extends IncomingMessage {
  query: {
    [key: string]: string | string[];
  };
  cookies: {
    [key: string]: string;
  };
  body: any;
  env: Env;
}

type NextApiResponse<T = any> = ServerResponse & {
  send: Send<T>;
  json: Send<T>;
  status: (statusCode: number) => NextApiResponse<T>;
  setPreviewData: (
    data: object | string,
    options?: {
      maxAge?: number;
    },
  ) => NextApiResponse<T>;
  clearPreviewData: () => NextApiResponse<T>;
};

interface Env {
  [key: string]: string;
}

type Send<T> = (body: T) => void;
