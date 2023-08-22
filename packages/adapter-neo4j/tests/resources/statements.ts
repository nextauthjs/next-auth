// Constraints and indexes - relevant to Neo4j Community Edition.
export default `
CREATE CONSTRAINT user_id_constraint IF NOT EXISTS
ON (u:User) ASSERT u.id IS UNIQUE;

CREATE INDEX user_id_index IF NOT EXISTS
FOR (u:User) ON (u.id);

CREATE INDEX user_email_index IF NOT EXISTS
FOR (u:User) ON (u.email);

CREATE CONSTRAINT session_session_token_constraint IF NOT EXISTS
ON (s:Session) ASSERT s.sessionToken IS UNIQUE;

CREATE INDEX session_session_token_index IF NOT EXISTS
FOR (s:Session) ON (s.sessionToken);

CREATE INDEX account_provider_index IF NOT EXISTS
FOR (a:Account) ON (a.provider);

CREATE INDEX account_provider_account_id_index IF NOT EXISTS
FOR (a:Account) ON (a.providerAccountId);

CREATE INDEX verification_token_identifier_index IF NOT EXISTS
FOR (v:VerificationToken) ON (v.identifier);

CREATE INDEX verification_token_token_index IF NOT EXISTS
FOR (v:VerificationToken) ON (v.token);`
