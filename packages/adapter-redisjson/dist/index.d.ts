import type { Adapter } from "next-auth/adapters";
import type { RedisClientType } from "redis";
export interface RedisJSONAdapterOptions {
    baseKeyPrefix?: string;
    accountKeyPrefix?: string;
    accountByUserIdPrefix?: string;
    emailKeyPrefix?: string;
    sessionKeyPrefix?: string;
    sessionByUserIdKeyPrefix?: string;
    userKeyPrefix?: string;
    verificationTokenKeyPrefix?: string;
}
export declare const defaultOptions: {
    baseKeyPrefix: string;
    accountKeyPrefix: string;
    accountByUserIdPrefix: string;
    emailKeyPrefix: string;
    sessionKeyPrefix: string;
    sessionByUserIdKeyPrefix: string;
    userKeyPrefix: string;
    verificationTokenKeyPrefix: string;
};
export declare function hydrateDates(json: object): any;
export declare function RedisJSONAdapter(client: RedisClientType, options?: RedisJSONAdapterOptions): Adapter;
