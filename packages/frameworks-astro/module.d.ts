/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
declare namespace App {
  interface Locals {
    session: import('@auth/core/types').Session | null
  }
}

declare module 'auth:config' {
  import type { AuthConfig } from '@auth/core'
	const config: (ctx: import('astro').APIContext) => AuthConfig
	export default config
}

declare module 'auth:config/client' {
  const config: { basePath: string }
	export default config
}
