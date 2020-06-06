// Type definitions for NextAuth v2.0.0
// Project: NextAuth
// Definitions by: Lluis Agusti <https://github.com/lluia>
import { NextApiRequest, NextApiResponse } from "next";
import { ConnectionOptions } from "typeorm";

export default function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: InitOptions
): Promise<void>;

declare namespace NextAuth {
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

  interface Cookie {
    name: string;
    options: CookieOptions;
  }

  interface CookieOptions {
    httpOnly?: boolean;
    // TODO: type available `sameSite` identifiers
    sameSite: "lax";
    path: string;
    secure: boolean;
  }
}
