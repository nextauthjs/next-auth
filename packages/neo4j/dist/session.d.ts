import neo4j from "neo4j-driver";
import { Neo4jUser } from "./user";
export interface Neo4jSession {
    id: string;
    userId: string;
    expires: Date | string;
    sessionToken: string;
    accessToken: string;
}
export declare const sessionReturn = "\n  {\n    userId: u.id,\n    id: s.id,\n    expires: s.expires.epochMillis, \n    accessToken: s.accessToken,\n    sessionToken: s.sessionToken\n  } AS session\n";
export declare const createSession: (neo4jSession: typeof neo4j.Session, user: Neo4jUser, sessionMaxAge: number) => Promise<any>;
export declare const getSession: (neo4jSession: typeof neo4j.Session, sessionToken: string) => Promise<any>;
export declare const updateSession: (neo4jSession: typeof neo4j.Session, session: Neo4jSession, force: boolean | undefined, sessionMaxAge: number, sessionUpdateAge: number) => Promise<any>;
export declare const deleteSession: (neo4jSession: typeof neo4j.Session, sessionToken: string) => Promise<void>;
