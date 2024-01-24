import Knex from "knex";
import { runBasicTests } from "utils/adapter";
import Adapter, { mapEmailVerified, mapExpires } from "../src";

const client = Knex({
	client: 'mysql2',
	connection: {
		host: "localhost",
		user: "admin",
		database: "adapter-knexjs",
		password: "secret",
		dateStrings: true,
		charset: 'utf8mb4',
		pool: { min: 2, max: 45 },
	}
});

runBasicTests({
	adapter: Adapter(client),
	db: {
		async disconnect() {
			await client.destroy();
		},
		async user(id: string) {
			return client('users').where('id', id).first().then(mapEmailVerified);
		},
		async account(account) {
			return client('accounts').where('providerAccountId', account.providerAccountId).first().then(row => row ?? null)
		},
		async session(sessionToken) {
			return client('sessions').where('sessionToken', sessionToken).first().then(mapExpires);
		},
		async verificationToken(identifier_token) {
			const { identifier, token } = identifier_token;
			return client('verification_token').where({
				identifier: identifier,
				token: token
			}).first().then(mapExpires);
		},
	},
})
