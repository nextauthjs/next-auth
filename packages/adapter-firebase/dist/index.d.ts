import * as admin from "firebase-admin";
import { AppOptions } from "next-auth";
interface IAdapterConfig {
    firestoreAdmin: admin.firestore.Firestore;
    usersCollection: "users" | string;
    accountsCollection: "accounts" | string;
    sessionsCollection: "sessions" | string;
    verificationRequestsCollection: "verificationRequests" | string;
}
export interface IProfile {
    name: string;
    email: string | null;
    image: string | null;
    emailVerified: boolean | undefined;
}
export interface IUser extends IProfile {
    id: string;
    createdAt: admin.firestore.FieldValue;
    updatedAt: admin.firestore.FieldValue;
}
export interface IAccount {
    providerId: string;
    providerAccountId: number | string;
    userId: string;
    providerType: string;
    refreshToken?: string;
    accessToken: string;
    accessTokenExpires: string;
    createdAt: admin.firestore.FieldValue;
    updatedAt: admin.firestore.FieldValue;
}
export interface ISession {
    id: string;
    userId: IUser["id"];
    expires: Date;
    sessionToken: string;
    accessToken: string;
    createdAt: admin.firestore.FieldValue;
    updatedAt: admin.firestore.FieldValue;
}
export interface IVerificationRequest {
    id: string;
    identifier: string;
    token: string;
    expires: Date | null;
    createdAt: admin.firestore.FieldValue;
    updatedAt: admin.firestore.FieldValue;
}
declare const Adapter: (config: IAdapterConfig, _options?: {}) => {
    getAdapter: (appOptions?: Partial<AppOptions> | undefined) => Promise<{
        createUser: (profile: IProfile) => Promise<IUser | null>;
        getUser: (id: IUser["id"]) => Promise<IUser>;
        getUserByEmail: (email: string) => Promise<IUser | null>;
        getUserByProviderAccountId: (providerId: IAccount["providerId"], providerAccountId: IAccount["providerAccountId"]) => Promise<IUser | null>;
        updateUser: (user: IUser) => Promise<IUser>;
        deleteUser: (userId: IUser["id"]) => Promise<void>;
        linkAccount: (userId: IAccount["userId"], providerId: IAccount["providerId"], providerType: IAccount["providerType"], providerAccountId: IAccount["providerAccountId"], refreshToken: IAccount["refreshToken"], accessToken: IAccount["accessToken"], accessTokenExpires: IAccount["accessTokenExpires"]) => Promise<IAccount>;
        unlinkAccount: (userId: IAccount["userId"], providerId: IAccount["providerId"], providerAccountId: IAccount["providerAccountId"]) => Promise<void>;
        createSession: (user: IUser) => Promise<ISession>;
        getSession: (sessionToken: ISession["sessionToken"]) => Promise<ISession | null>;
        updateSession: (session: ISession, force: boolean) => Promise<ISession | null>;
        deleteSession: (sessionToken: ISession["sessionToken"]) => Promise<void>;
        createVerificationRequest: (identifier: string, url: string, token: string, secret: string, provider: {
            maxAge: number;
            sendVerificationRequest: ({}: any) => {};
        }) => Promise<IVerificationRequest>;
        getVerificationRequest: (identifier: string, token: string, secret: string, _provider: any) => Promise<IVerificationRequest | null>;
        deleteVerificationRequest: (identifier: string, token: string, secret: string, _provider: any) => Promise<void>;
    }>;
};
export default Adapter;
