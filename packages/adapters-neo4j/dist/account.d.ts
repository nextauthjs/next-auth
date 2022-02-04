import neo4j from "neo4j-driver";
export interface Neo4jAccount {
    id: string;
    userId: string;
    providerType: string;
    providerId: string;
    providerAccountId: string;
    refreshToken: string | null | undefined;
    accessToken: string | null | undefined;
    accessTokenExpires: Date | null | undefined;
}
export declare const accountReturn = "\n  {\n    userId: u.id,\n    providerId: a.providerId,\n    providerAccountId: a.providerAccountId,\n    providerType: a.providerType,\n    refreshToken: a.refreshToken,\n    accessToken: a.accessToken,\n    accessTokenExpires: a.accessTokenExpires\n  } AS account\n";
export declare const linkAccount: (neo4jSession: typeof neo4j.Session, userId: Neo4jAccount["userId"], providerId: Neo4jAccount["providerId"], providerType: Neo4jAccount["providerType"], providerAccountId: Neo4jAccount["providerAccountId"], refreshToken: Neo4jAccount["refreshToken"], accessToken: Neo4jAccount["accessToken"], accessTokenExpires: Neo4jAccount["accessTokenExpires"]) => Promise<any>;
export declare const unlinkAccount: (neo4jSession: typeof neo4j.Session, _: string, providerId: string, providerAccountId: string) => Promise<void>;
