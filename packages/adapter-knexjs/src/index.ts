/**
 * 
 * create mysql table from the schema.sql folder
 * 
 * and import the adapter, no extra step is needed
 * 
 * the adapter also supports custom idGenerator function
 * 
 * @module @auth/knexjs-adapter
 */

import type { Adapter } from "@auth/core/adapters";
import * as crypto from "crypto";
import type { Knex } from "knex";

function idGenerator(type: string) {
	return crypto.randomUUID();
}

type User = {
	id: string
	name: string
	email: string
	emailVerified: string
	image: string
}
const userFields = [
	"users.id",
	"users.name",
	"users.email",
	"users.emailVerified",
	"users.image",
];

type Session = {
	id: string
	userId: string
	expires: string
	sessionToken: string
}
const sessionFields = [
	"sessions.id",
	"sessions.userId",
	"sessions.expires",
	"sessions.sessionToken",
];

export function mapEmailVerified<Type extends { emailVerified: string }>(user: Type) {
	if (user) {
		return {
			...user,
			emailVerified: new Date(user.emailVerified)
		}
	}
	return null
}

export function mapExpires<Type extends { expires: string }>(user: Type | undefined) {
	if (user) {
		return {
			...user,
			expires: new Date(user.expires)
		}
	}
	return null
}

export default function adapter(knex: Knex, id = idGenerator) {
	const adapter: Adapter = {
		async createVerificationToken(verificationToken) {
			const { identifier, expires, token } = verificationToken;
			await knex('verification_token').insert({ identifier, expires, token });
			return verificationToken;
		},
		async useVerificationToken({ identifier, token }) {
			return knex.transaction(async trx => {
				const q = trx.table('verification_token')
					.where({
						identifier: identifier,
						token: token
					})
					.select<{ identifier: string, expires: string, token: string }[]>("*");
				const row = await q.clone().first()
				if (!row) {
					return null;
				}
				await q.del();
				return {
					...row,
					expires: new Date(row.expires)
				};
			});
		},
		async createUser(user) {
			const { name, email, emailVerified, image } = user;
			const payload = {
				id: id("user"),
				name: name,
				email: email,
				emailVerified: emailVerified,
				image: image
			}
			await knex('users').insert(payload);
			return payload;
		},
		async getUser(id) {
			return knex('users')
				.where('id', id)
				.first<User>(userFields)
				.then(mapEmailVerified)
		},
		async getUserByEmail(email) {
			return knex('users').where('email', email).first<User>(userFields).then(mapEmailVerified);
		},
		async getUserByAccount({ providerAccountId, provider }) {
			return knex('users')
				.join('accounts', 'users.id', 'accounts.userId')
				.where({
					'accounts.provider': provider,
					'accounts.providerAccountId': providerAccountId
				})
				.select('users.*')
				.first<User>(userFields)
				.then(mapEmailVerified)
		},
		async updateUser(data) {
			const { id, ...payload } = data;
			await knex.table('users').where('id', id).update(payload);
			const user = await knex.table("users").where("id", id).first<User>(userFields).then(mapEmailVerified);
			if (!user) {
				throw new Error("couldn't find user");
			}
			return user;
		},
		async linkAccount(account) {
			// console.dir(account, {depth: 10});
			const {
				userId,
				provider,
				type,
				providerAccountId,
				access_token,
				expires_at,
				refresh_token,
				id_token,
				scope,
				session_state,
				token_type
			} = account;
			const payload = {
				id: id("account"),
				userId: userId,
				provider: provider,
				type: type,
				providerAccountId: providerAccountId,
				access_token: access_token,
				expires_at: expires_at!,
				refresh_token: refresh_token,
				id_token: id_token,
				scope: scope,
				session_state: session_state,
				token_type: token_type
			};
			await knex('accounts').insert(payload);
			return payload;
		},
		async createSession({ sessionToken, userId, expires }) {
			if (userId === undefined) {
				throw new Error(`userId is undefined in createSession`);
			}
			const payload = {
				id: id("session"),
				userId: userId,
				expires: expires,
				sessionToken: sessionToken
			};
			await knex('sessions').insert(payload);
			return payload;
		},
		async getSessionAndUser(sessionToken) {
			if (sessionToken === undefined) {
				return null;
			}

			// Fetch the session
			const session = await knex('sessions')
				.where('sessionToken', sessionToken)
				.first<Session>(sessionFields)
				.then(mapExpires)

			if (!session) {
				return null;
			}

			// Fetch the user associated with the session
			const user = await knex('users')
				.where('id', session.userId)
				.first<User>(userFields)
				.then(mapEmailVerified);

			if (!user) {
				return null;
			}

			return {
				session: session,
				user,
			};
		},
		async updateSession(session) {
			const { sessionToken } = session;
			await knex.table("sessions")
				.where('sessionToken', sessionToken)
				.update(session);
			return knex('sessions')
				.where('sessionToken', sessionToken)
				.first<Session>(sessionFields)
				.then(mapExpires)
		},
		async deleteSession(sessionToken) {
			await knex('sessions').where('sessionToken', sessionToken).del();
		},
		async unlinkAccount(partialAccount) {
			await knex('accounts')
				.where({
					providerAccountId: partialAccount.providerAccountId,
					provider: partialAccount.provider
				})
				.del();
		},
		async deleteUser(userId) {
			return knex.transaction(async trx => {
				await trx.table('users').where('id', userId).del();
				await trx.table('sessions').where('userId', userId).del();
				await trx.table('accounts').where('userId', userId).del();
				return null;
			});
		}
	}
	return adapter;
}