// USER
export const CREATE_USER_SQL = `INSERT INTO users (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)`
export const GET_USER_BY_ID_SQL = `SELECT * FROM users WHERE id = ?`
export const GET_USER_BY_EMAIL_SQL = `SELECT * FROM users WHERE email = ?`
export const GET_USER_BY_ACCOUNTL_SQL = `
  SELECT u.*
  FROM users u JOIN accounts a ON a.userId = u.id
  WHERE a.providerAccountId = ? AND a.provider = ?`
export const UPDATE_USER_BY_ID_SQL = `
  UPDATE users 
  SET name = ?, email = ?, emailVerified = ?, image = ?
  WHERE id = ? `
export const DELETE_USER_SQL = `DELETE FROM users WHERE id = ?`

// SESSION
export const CREATE_SESSION_SQL =
  "INSERT INTO sessions (id, sessionToken, userId, expires) VALUES (?,?,?,?)"
export const GET_SESSION_BY_TOKEN_SQL = `
  SELECT id, sessionToken, userId, expires
  FROM sessions
  WHERE sessionToken = ?`
export const UPDATE_SESSION_BY_SESSION_TOKEN_SQL = `UPDATE sessions SET expires = ? WHERE sessionToken = ?`
export const DELETE_SESSION_SQL = `DELETE FROM sessions WHERE sessionToken = ?`
export const DELETE_SESSION_BY_USER_ID_SQL = `DELETE FROM sessions WHERE userId = ?`

// ACCOUNT
export const CREATE_ACCOUNT_SQL = `
  INSERT INTO accounts (
    id, userId, type, provider, 
    providerAccountId, refresh_token, access_token, 
    expires_at, token_type, scope, id_token, session_state,
    oauth_token, oauth_token_secret
  ) 
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const GET_ACCOUNT_BY_ID_SQL = `SELECT * FROM accounts WHERE id = ? `
export const GET_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL = `SELECT * FROM accounts WHERE provider = ? AND providerAccountId = ?`
export const DELETE_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL = `DELETE FROM accounts WHERE provider = ? AND providerAccountId = ?`
export const DELETE_ACCOUNT_BY_USER_ID_SQL = `DELETE FROM accounts WHERE userId = ?`

// VERIFICATION_TOKEN
export const GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL = `SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?`
export const CREATE_VERIFICATION_TOKEN_SQL = `INSERT INTO verification_tokens (identifier, expires, token) VALUES (?,?,?)`
export const DELETE_VERIFICATION_TOKEN_SQL = `DELETE FROM verification_tokens WHERE identifier = ? and token = ?`
