import neo4j from "neo4j-driver";
import type { Profile } from "next-auth";
export interface Neo4jUser {
    id: string;
    name?: string;
    email?: string;
    emailVerified?: Date | null;
    image?: string;
}
export declare const userReturn = "\n  { \n    id: u.id,\n    name: u.name,\n    email: u.email,\n    image: u.image,\n    emailVerified: u.emailVerified.epochMillis\n  } AS user \n";
export declare const createUser: (neo4jSession: typeof neo4j.Session, profile: Profile & {
    emailVerified?: Date;
}) => Promise<any>;
export declare const getUser: (neo4jSession: typeof neo4j.Session, id: String) => Promise<any>;
export declare const getUserByEmail: (neo4jSession: typeof neo4j.Session, email: String | null) => Promise<any>;
export declare const getUserByProviderAccountId: (neo4jSession: typeof neo4j.Session, providerId: string, providerAccountId: string) => Promise<any>;
export declare const updateUser: (neo4jSession: typeof neo4j.Session, user: Neo4jUser & {
    id: string;
}) => Promise<any>;
export declare const deleteUser: (neo4jSession: typeof neo4j.Session, id: string) => Promise<void>;
