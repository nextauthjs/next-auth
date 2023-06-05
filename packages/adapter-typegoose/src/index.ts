/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://typegoose.github.io">Typegoose</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://typegoose.github.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/typegoose.svg" width="30" />
 *  </a>
 * </div>
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/typegoose-adapter @typegoose/typegoose mongoose
 * ```
 *
 * @module @next-auth/typegoose-adapter
 */
export { TypegooseAdapter } from "./adapter"
export { configureMongoDBClient } from "./client"

export type { MongoDBClientConfig } from "./client"
export type { TypegooseAdapterOptions } from "./adapter"
