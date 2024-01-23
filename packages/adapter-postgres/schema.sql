\set ON_ERROR_STOP true 

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,


PRIMARY KEY (identifier, token) );

CREATE TABLE accounts
(
  id SERIAL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  provider_id VARCHAR(255) NOT NULL,
  provider_type VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,


PRIMARY KEY (id) );

CREATE TABLE sessions
(
  id SERIAL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires TIMESTAMPTZ NOT NULL,
  session_token VARCHAR(255) NOT NULL,


PRIMARY KEY (id) );

CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  image TEXT,


PRIMARY KEY (id) );