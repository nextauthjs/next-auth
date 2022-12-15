import type { JWT, JWTDecodeParams, JWTEncodeParams, JWTOptions } from "./types.js";
import type { LoggerInstance } from "../index.js";
export * from "./types.js";
/** Issues a JWT. By default, the JWT is encrypted using "A256GCM". */
export declare function encode(params: JWTEncodeParams): Promise<string>;
/** Decodes a NextAuth.js issued JWT. */
export declare function decode(params: JWTDecodeParams): Promise<JWT | null>;
export interface GetTokenParams<R extends boolean = false> {
    /** The request containing the JWT either in the cookies or in the `Authorization` header. */
    req: Request | {
        cookies: Record<string, string>;
        headers: Record<string, string>;
    };
    /**
     * Use secure prefix for cookie name, unless URL in `NEXTAUTH_URL` is http://
     * or not set (e.g. development or test instance) case use unprefixed name
     */
    secureCookie?: boolean;
    /** If the JWT is in the cookie, what name `getToken()` should look for. */
    cookieName?: string;
    /**
     * `getToken()` will return the raw JWT if this is set to `true`
     * @default false
     */
    raw?: R;
    /**
     * The same `secret` used in the `NextAuth` configuration.
     * Defaults to the `NEXTAUTH_SECRET` environment variable.
     */
    secret?: string;
    decode?: JWTOptions["decode"];
    logger?: LoggerInstance | Console;
}
/**
 * Takes a NextAuth.js request (`req`) and returns either the NextAuth.js issued JWT's payload,
 * or the raw JWT string. We look for the JWT in the either the cookies, or the `Authorization` header.
 * [Documentation](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken)
 */
export declare function getToken<R extends boolean = false>(params: GetTokenParams<R>): Promise<R extends true ? string : JWT | null>;
//# sourceMappingURL=index.d.ts.map