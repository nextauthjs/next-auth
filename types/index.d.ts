// Minimum TypeScript Version: 3.8
/// <reference types="node" />
/// <reference types="typeorm" />
/// <reference types="next" />
import type { ConnectionOptions } from 'typeorm';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function NextAuth(req: NextApiRequest, res: NextApiResponse, options?: InitOptions): Promise<void>;

export interface InitOptions {
  site: string;
  // TODO: type providers
  providers: unknown[];
  databse: ConnectionOptions;
  secret?: string;
  jwt?: boolean;
  jwtSecret?: string;
  sessionMaxAge?: number;
  sessionUpdateAge?: number;
  verificationMaxAge?: number;
  pages?: PageOptions;
  debug?: boolean;
  basePath?: string;
  // TODO: type options
  callbackUrlHandler?: (url: string, options: unknown) => Promise<void>;
  // TODO: type adapters
  adapter?: unknown[];
  useSecureCookies?: boolean;
  cookies?: Cookies;
}

export interface PageOptions {
  signin?: string;
  signout?: string;
  error?: string;
  verifyRequest?: string;
  newUsers?: string | null;
}

export interface Cookies {
  [cookieKey: string]: Cookie;
}

export interface Cookie {
  name: string;
  options: CookieOptions;
}

export interface CookieOptions {
  httpOnly?: boolean;
  // TODO: type available `sameSite` identifiers
  sameSite: 'lax';
  path: string;
  secure: boolean;
}
