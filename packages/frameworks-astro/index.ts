/**
 * Astro Auth is the unofficial Astro integration for Auth.js.
 * It provides a simple way to add authentication to your Astro site in a few lines of code.
 *
 * ## Installation
 *
 * `@auth/astro` requires building your site in `server` mode with a platform adaper like `@astrojs/node`.
 * In addition, you'll need to add `@auth/astro` as an integration to your `astro.config.mjs` file.
 * ```bash npm2yarn2pnpm
 * npx astro add @astrojs/node
 * npm install @auth/core @auth/astro
 * ```
 * 
 * ```js
 * // ...
 * 
 * import authAstro from '@auth/astro'
 * 
 * // astro.config.mjs
 * export default defineConfig({
 *   output: "server",
 *   integrations: [
 *     authAstro({
 *       providers: [
 *        // ...
 *       ]
 *     })
 *   ],
 *   adapter: node({
 *     mode: 'standalone'
 *   })
 * });
 * ```
 *
 * @module main
 */
import integration from './src/integration'

export default integration
