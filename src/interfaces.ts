import { ConnectionOptions } from "typeorm";
import { ProviderEmailOptions } from "./providers/email";
import { ProviderCredentialsOptions } from "./providers/credentials";
import jwt from "./lib/jwt";
import events from "./server/lib/events";
import callbacks from "./server/lib/callbacks";


export interface NextAuthAdapter {
    createUser: (profile: any) => Promise<any>;
    getUser: (id: any) => Promise<any>;
    getUserByEmail: (id: any) => Promise<any>;
    getUserByProviderAccountId: (providerId: any, providerAccountId: any) => Promise<any>;
    updateUser: (user: any) => Promise<any>;
    deleteUser: (userId: any) => Promise<any>;
    linkAccount: (userId: any, providerId: any, providerType: any, providerAccountId: any, refreshToken: any, accessToken: any, accessTokenExpires: any) => Promise<any>;
    unlinkAccount: (userId: any, providerId: any, providerAccountId: any) => Promise<boolean>;
    createSession: (user: any) => Promise<any>;
    getSession: (sessionToken: any) => Promise<any>;
    updateSession: (session: any, force?: boolean) => Promise<any>;
    deleteSession: (sessionToken: any) => Promise<any>;
    createVerificationRequest: (identifier: any, url: any, token: any, secret: any, provider: any) => Promise<any>;
    getVerificationRequest: (identifier: any, token: any, secret: any, provider: any) => Promise<any>
    deleteVerificationRequest: (identifier: any, token: any, secret: any, provider: any) => Promise<never>
}

// todo: figure this part out
export interface NextAuthAdapterWrapper {
    getAdapter(options: InternalOptions): NextAuthAdapter | Promise<NextAuthAdapter>;
}

export type NextAuthAdapterFactory<TConfig = any, TOptions = undefined> = (config: TConfig, options?: TOptions) => NextAuthAdapterWrapper;

export interface NextAuthProfile {
    id: string;
    name: string;
    email?: string;
    image: string;
}
export type ProviderReturnConfig = ProviderEmailConfig | ProviderCredentialsConfig | ProviderOAuthConfig;

export interface ProviderBaseInternalConfig {
    signinUrl: string;
    callbackUrl: string;
}
export type ProviderInternalConfig = ProviderBaseInternalConfig & ProviderReturnConfig



export interface ProviderBaseConfig {
    id: string;
    name: string;
    type: string;
}

export interface ProviderEmailConfig extends ProviderEmailOptions, ProviderBaseConfig { }

export interface ProviderCredentialsConfig extends ProviderCredentialsOptions, ProviderBaseConfig { }

export interface ProviderOAuthConfig extends ProviderBaseConfig {
    version: string;
    params?: Record<string, string>;
    scope: string;
    accessTokenUrl: string;
    requestTokenUrl?: string;
    authorizationUrl: string;
    profileUrl: string;
    profile: (profile: any) => null | NextAuthProfile | Promise<NextAuthProfile>;
    setGetAccessTokenAuthHeader?: boolean;
}

export interface ProviderBasicOptions {
    clientId: string;
    clientSecret: string;
}

/**
 * Type guard to check if the provider is of credentials type
 * @param obj 
 */
export function isCredentialsProvider(obj: ProviderReturnConfig): obj is ProviderCredentialsConfig {
    return obj && obj.type === 'credentials';
}

/**
 * Type guard to check if the provider is of oauth type
 * @param obj 
 */
export function isOAuthProvider(obj: ProviderReturnConfig): obj is ProviderOAuthConfig {
    return obj && obj.type === 'oauth2';
}

/**
 * Type guard to check if the provider is of email type
 * @param obj 
 */
export function isEmailProvider(obj: ProviderReturnConfig): obj is ProviderEmailConfig {
    return obj && obj.type === 'email';
}

export interface Session {
    user: {
        name: string;
        email: string;
        image: string;
    };
    accessToken: string;
    expires: string;
}

export interface JWTPayload {
    name: string;
    email: string;
    picture: string; // todo: is this a bug?
};

export interface InternalOptions extends Omit<InitOptions, "providers"> {
    providers: Record<string, ProviderInternalConfig>,
    baseUrl: string // populated from NEXTAUTH_URL or VERCEL_URL
    callbackUrl: string;
    action: any;
    provider: any;
    csrfToken: string;
    redirect: (redirectUrl: string) => void;
}

export interface InitOptions {
    site: string;
    providers: ProviderReturnConfig[];
    database?: ConnectionOptions | string;
    secret?: string;
    jwt?: JWTOptions,
    jwtSecret?: string;
    sessionMaxAge?: number;
    sessionUpdateAge?: number;
    verificationMaxAge?: number;
    pages?: PageOptions;
    debug?: boolean;
    basePath?: string;
    callbackUrlHandler?: (url: string, options: CallbackURLOptions) => Promise<void>;
    adapter?: NextAuthAdapterWrapper;
    useSecureCookies?: boolean;
    cookies?: Cookies;
    session: SessionOptions;
    events: EventsOptions;
    callbacks: Callbacks;
}

export interface JWTOptions {
    secret?: string;
    encryption?: boolean;
    encode?: typeof jwt.encode;
    decode?: typeof jwt.decode;
    [k: string]: any
}

export interface PageOptions {
    signIn?: string;
    signOut?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string | null;
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
    sameSite: string;
    path: string;
    secure: boolean;

    expires?: ConstructorParameters<typeof Date>[0],
    maxAge?: number
}

export interface CallbackURLOptions {
    site: string;
    defaultCallbackUrl?: string;
    cookies?: Cookies;
    callbacks?: Callbacks;
}

export interface GenericObject {
    [key: string]: any;
}


export interface SessionOptions {
    jwt?: boolean;
    maxAge?: number;
    updateAge?: number;
}

type Events = typeof events;
export interface EventsOptions extends Events { }

type Callbacks = typeof callbacks