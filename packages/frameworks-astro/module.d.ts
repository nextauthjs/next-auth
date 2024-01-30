declare namespace App {
  interface Locals {
    session: import('@auth/core/types').Session | null
  }
}

declare module 'auth:config' {
  import type { AuthConfig } from '@auth/core'
  interface FullAuthConfig extends AuthConfig {
    basePath: string
  }
	const config: (ctx: import('astro').APIContext) => FullAuthConfig
	export default config
}

declare module 'auth:config/client' {
  const config: { basePath: string }
	export default config
}
