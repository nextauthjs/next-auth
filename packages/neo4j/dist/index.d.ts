import neo4j from "neo4j-driver";
import type { Profile } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { Neo4jUser } from "./user";
import { Neo4jSession } from "./session";
export declare const Neo4jAdapter: Adapter<typeof neo4j.Session, never, Neo4jUser, Profile & {
    emailVerified?: Date;
}, Neo4jSession>;
