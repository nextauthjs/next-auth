use mysql_database
CREATE TABLE sessions
(
  id SERIAL,
  userId INTEGER NOT NULL,
  expires TIMESTAMP(3) NOT NULL,
  sessionToken VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);
CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  emailVerified timestamp(3),
  image TEXT,

  PRIMARY KEY (id)
);
CREATE TABLE accounts
(
  id SERIAL,
  userId INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  providerAccountId VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  PRIMARY KEY (id)
);
CREATE TABLE verification_token
(
  identifier varchar(100) NOT NULL,
  expires TIMESTAMP(3) NOT NULL,
  token varchar(100) NOT NULL,

  PRIMARY KEY (identifier, token)
);
