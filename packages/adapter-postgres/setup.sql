
CREATE TABLE users
(
id uuid NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255),
 "emailVerified" TIMESTAMPTZ,
  image TEXT,


PRIMARY KEY (id) );

CREATE TABLE verification_token (
    identifier TEXT NOT NULL, expires TIMESTAMPTZ NOT NULL, token TEXT NOT NULL, PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
    id uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL REFERENCES users (id), type VARCHAR(255) NOT NULL, provider VARCHAR(255) NOT NULL, "providerAccountId" VARCHAR(255) NOT NULL, refresh_token TEXT, access_token TEXT, expires_at BIGINT, id_token TEXT, scope TEXT, session_state TEXT, token_type TEXT, PRIMARY KEY (id)
);

CREATE TABLE sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL REFERENCES users (id), expires TIMESTAMPTZ NOT NULL, "sessionToken" VARCHAR(255) NOT NULL, PRIMARY KEY (id)
);