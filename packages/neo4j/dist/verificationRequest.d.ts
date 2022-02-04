import neo4j from "neo4j-driver";
import { EmailConfig } from "next-auth/providers";
export declare const verificationRequestReturn = "\n  {\n    identifier: v.identifier,\n    token: v.token,\n    expires: v.expires.epochMillis \n  } AS verificationRequest \n";
export declare const createVerificationRequest: (neo4jSession: typeof neo4j.Session, identifier: string, url: string, token: string, _: string, provider: EmailConfig & {
    maxAge: number;
    from: string;
}, hashToken: any, baseUrl: string) => Promise<void>;
export declare const getVerificationRequest: (neo4jSession: typeof neo4j.Session, identifier: string, token: string, hashToken: any) => Promise<any>;
export declare const deleteVerificationRequest: (neo4jSession: typeof neo4j.Session, identifier: string, token: string, hashToken: any) => Promise<void>;
