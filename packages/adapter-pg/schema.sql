\set ON_ERROR_STOP true

CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
 
  PRIMARY KEY (id)
);

CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id),
  UNIQUE (provider, "providerAccountId")
);
 
CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
 
  PRIMARY KEY (id)
);

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
