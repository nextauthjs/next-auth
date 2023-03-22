import { D1Database } from "@cloudflare/workers-types";
import { D1Database as MiniflareD1Database } from "@miniflare/d1";
import * as crypto from 'crypto';
import {
  Adapter,
  AdapterSession,
  AdapterUser,
  AdapterAccount,
} from "next-auth/adapters";
export { up } from "./migrations";

// some handy internal type aliases
export type BothDB = D1Database | MiniflareD1Database;
interface AdapterVerificationToken {
  expires: Date;
  identifier: string;
  token: string;
}

// all the sqls
// USER
export const CREATE_USER_SQL = `INSERT INTO authjs_users (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)`;
export const GET_USER_BY_ID_SQL = `SELECT * FROM authjs_users WHERE id = ?`;
export const GET_USER_BY_EMAIL_SQL = `SELECT * FROM authjs_users WHERE email = ?`;
export const GET_USER_BY_ACCOUNTL_SQL = `
  SELECT u.*
  FROM authjs_users u JOIN authjs_accounts a ON a.userId = u.id
  WHERE a.providerAccountId = ? AND a.provider = ?`;
export const UPDATE_USER_BY_ID_SQL = `
  UPDATE authjs_users 
  SET name = ?, email = ?, emailVerified = ?, image = ?
  WHERE id = ? `;
export const DELETE_USER_SQL = `DELETE FROM authjs_users WHERE id = ?`;

  // SESSION
export const CREATE_SESSION_SQL = 'INSERT INTO authjs_sessions (id, sessionToken, userId, expires) VALUES (?,?,?,?)';
export const GET_SESSION_BY_TOKEN_SQL = `
  SELECT id, sessionToken, userId, expires
  FROM authjs_sessions
  WHERE sessionToken = ?`;
export const UPDATE_SESSION_BY_SESSION_TOKEN_SQL = `UPDATE authjs_sessions SET expires = ? WHERE sessionToken = ?`;
export const DELETE_SESSION_SQL = `DELETE FROM authjs_sessions WHERE sessionToken = ?`;
export const DELETE_SESSION_BY_USER_ID_SQL = `DELETE FROM authjs_sessions WHERE userId = ?`;

// ACCOUNT
export const CREATE_ACCOUNT_SQL = `
  INSERT INTO authjs_accounts (
    id, userId, type, provider, 
    providerAccountId, refresh_token, access_token, 
    expires_at, token_type, scope, id_token, session_state,
    oauth_token, oauth_token_secret
  ) 
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
export const GET_ACCOUNT_BY_ID_SQL = `SELECT * FROM authjs_accounts WHERE id = ? `
export const GET_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL = `SELECT * FROM authjs_accounts WHERE provider = ? AND providerAccountId = ?`;
export const DELETE_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL = `DELETE FROM authjs_accounts WHERE provider = ? AND providerAccountId = ?`;
export const DELETE_ACCOUNT_BY_USER_ID_SQL = `DELETE FROM authjs_accounts WHERE userId = ?`;

// VERIFICATION_TOKEN
export const GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL= `SELECT * FROM authjs_verification_tokens WHERE identifier = ? AND token = ?`;
export const CREATE_VERIFICATION_TOKEN_SQL = `INSERT INTO authjs_verification_tokens (identifier, expires, token) VALUES (?,?,?)`;
export const DELETE_VERIFICATION_TOKEN_SQL = `DELETE FROM authjs_verification_tokens WHERE identifier = ? and token = ?`;

// helper functions

// isDate is borrowed from the supabase adapter, graciously
// depending on error messages ("Invalid Date") is always precarious, but probably fine for a built in native like Date
function isDate(date: any) {
  return (
    new Date(date).toString() !== "Invalid Date" && !isNaN(Date.parse(date))
  )
}

// format is borrowed from the supabase adapter, graciously
function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete obj[key];
    }

    if (isDate(value)) {
      obj[key] = new Date(value);
    }
  }

  return obj as T
}

// D1 doesnt like undefined, it wants null when calling bind
function cleanBindings(bindings: any[]) {
  return bindings.map(e=> e === undefined ? null : e)
}

export async function createRecord<RecordType>(db:BothDB, CREATE_SQL:string, bindings: any[], GET_SQL:string, getBindings: any[]):Promise<RecordType | null> {
  try {
    bindings = cleanBindings(bindings)
    await db.prepare(CREATE_SQL).bind(...bindings).run()
    return await getRecord<RecordType>(db, GET_SQL, getBindings)
  } catch(e:any) {
    console.log(`Error creating record with ${CREATE_SQL} and bindings ${bindings}`)
    console.log(`D1 ERROR MESSAGE`, e.message, e.cause?.message)
    throw e
  }
}

export async function getRecord<RecordType>(db:BothDB, SQL:string, bindings:any[]):Promise<RecordType | null> {
  try {
    bindings = cleanBindings(bindings)
    const res:any = await db.prepare(SQL).bind(...bindings).first()
    if(res) {
      return format<RecordType>(res)
    } else {
      return null
    }
  } catch(e:any) {
    console.log(`Error getting record with ${SQL} and bindings ${bindings}`)
    console.log(`D1 ERROR MESSAGE`, e.message, e.cause?.message)
    throw e
  }
}

export async function updateRecord(db:BothDB, SQL:string, bindings:any[]) {
  try {
    bindings = cleanBindings(bindings)
    return await db.prepare(SQL).bind(...bindings).run()
  } catch(e:any) {
    console.log(`Error updating record with ${SQL} and bindings ${bindings}`)
    console.log(`D1 ERROR MESSAGE`, e.message, e.cause?.message)
    throw e
  }
}

export async function deleteRecord(db:BothDB, SQL:string, bindings:any[]) {
  // eslint-disable-next-line no-useless-catch
  try {
    bindings = cleanBindings(bindings)
    await db.prepare(SQL).bind(...bindings).run()
  } catch(e:any) {
    console.log(`Error deleting record with ${SQL} and bindings ${bindings}`)
    console.log(`D1 ERROR MESSAGE`, e.message, e.cause?.message)
    throw e
  }
}

// The Adapter Implementation
export function D1Adapter(db:BothDB): Adapter {

  // we need to run migrations if we dont have the right tables

  return {
    async createUser(user) {
      console.log('Creating User:', user)
      const id: string = crypto.randomUUID();
      const createBindings = [id, user.name , user.email, user.emailVerified?.toISOString(), user.image];
      const getBindings = [id];
      const newUser = await createRecord<AdapterUser>(
        db, 
        CREATE_USER_SQL, createBindings,
        GET_USER_BY_ID_SQL, getBindings
      );
      // this method cant return null, gotta throw
      if(newUser) return newUser;
      throw new Error(`Couldn't create a new user`);
    },
    async getUser(id) {
      return await getRecord<AdapterUser>(db,GET_USER_BY_ID_SQL,[id]);
    },
    async getUserByEmail(email) {
      return await getRecord<AdapterUser>(db,GET_USER_BY_EMAIL_SQL,[email]);
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return await getRecord<AdapterUser>(db,GET_USER_BY_ACCOUNTL_SQL,[providerAccountId,provider]);
      
    },
    async updateUser(user) {
      const params = await getRecord<AdapterUser>(db,GET_USER_BY_ID_SQL,[user.id]);
      if(params) {
        // copy any properties not in the update into the existing one and use that for bind params
        // covers the scenario where the user arg doesnt have all of the current users properties
        Object.assign(params,user);
        const res = await updateRecord(db,UPDATE_USER_BY_ID_SQL,[params.name, params.email, params.emailVerified?.toISOString(), params.image, params.id]);
        if(res.success) {
         // we could probably just return 
         const user = await getRecord<AdapterUser>(db,GET_USER_BY_ID_SQL,[params.id]);
         if(user) return user;
         throw new Error(`couldnt find user after update with id ${params.id}`);
        } 
        throw new Error(`couldnt update user with data ${JSON.stringify(user)}`);
      }
      throw new Error(`couldnt find user to update from id ${user.id}`);
    },
    async deleteUser(userId) {
      // this should probably be in a db.batch but batch has problems right now in miniflare
      // no multi line sql statements
      await deleteRecord(db, DELETE_ACCOUNT_BY_USER_ID_SQL, [userId]);
      await deleteRecord(db, DELETE_SESSION_BY_USER_ID_SQL, [userId]);
      await deleteRecord(db, DELETE_USER_SQL, [userId]);
      return null;
    },
    async linkAccount(a) {
      // convert user_id to userId and provider_account_id to providerAccountId
      const id = crypto.randomUUID();
      const createBindings = [id, a.userId, a.type, a.provider,
            a.providerAccountId, a.refresh_token , a.access_token,
            a.expires_at, a.token_type, a.scope, a.id_token, a.session_state,
            a.oauth_token?? null, a.oauth_token_secret?? null];
      const getBindings = [id];
      return await createRecord<AdapterAccount>(
        db,
        CREATE_ACCOUNT_SQL, createBindings,
        GET_ACCOUNT_BY_ID_SQL, getBindings
      );
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await deleteRecord(db, DELETE_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL, [provider, providerAccountId]);
    },
    async createSession({ sessionToken, userId, expires }) {
      const id = crypto.randomUUID();
      const createBindings = [id, sessionToken, userId, expires.toISOString()];
      const getBindings = [sessionToken];
      const session =  await createRecord<AdapterSession>(
        db,
        CREATE_SESSION_SQL, createBindings,
        GET_SESSION_BY_TOKEN_SQL, getBindings
      );
      if(session) return session;
      throw new Error(`Couldn't create session`);
    },
    async getSessionAndUser(sessionToken) {
      const session:any = await getRecord<AdapterSession>(db,GET_SESSION_BY_TOKEN_SQL,[sessionToken]);
      // no session?  no user!
      if(session === null) return null;

      // this shouldnt happen, but just in case
      const user = await getRecord<AdapterUser>(db,GET_USER_BY_ID_SQL,[session.userId]);
      if(user === null) return null;

      return {session, user};
    },
    async updateSession({ sessionToken, expires }) {
      // kinda strange that we have to deal with an undefined expires,
      // we dont have any policy to enforce, lets just expire it now.
      if(expires === undefined) {
        await deleteRecord(db, DELETE_SESSION_SQL, [sessionToken])
        return null
      }
      const session = await getRecord<AdapterSession>(db, GET_SESSION_BY_TOKEN_SQL,[sessionToken])
      if(!session) return null
      session.expires = expires;
      await updateRecord(db, UPDATE_SESSION_BY_SESSION_TOKEN_SQL, [expires?.toISOString(), sessionToken])
      return await db.prepare(UPDATE_SESSION_BY_SESSION_TOKEN_SQL).bind(expires?.toISOString(), sessionToken).first()
    },
    async deleteSession(sessionToken) {
      await deleteRecord(db, DELETE_SESSION_SQL, [sessionToken])
      return null
    },
    async createVerificationToken({ identifier, expires, token }) {
      return await createRecord(
        db, 
        CREATE_VERIFICATION_TOKEN_SQL,[identifier, expires.toISOString(), token],
        GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL,[identifier, token]
      )
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await getRecord<AdapterVerificationToken>(db, GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL, [identifier, token])
      if(!verificationToken) return null
      await deleteRecord(db, DELETE_VERIFICATION_TOKEN_SQL, [identifier, token])
      return verificationToken
    },
  }
}
