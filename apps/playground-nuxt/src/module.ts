import { fileURLToPath } from 'url'
import { addImports, addPlugin, defineNuxtModule, extendViteConfig } from '@nuxt/kit'
import { resolve } from 'pathe'

export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'next-auth-nuxt',
    configKey: 'auth'
  },
  defaults: {
  },
  async setup (_options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin.client'))

    // Composables are auto-imported in client.
    const client = resolve(runtimeDir, 'client')
    await addImports([
      { name: 'getSession', from: client },
      { name: 'getCsrfToken', from: client },
      { name: 'getProviders', from: client },
      { name: 'signIn', from: client },
      { name: 'signOut', from: client },
      { name: 'useSession', from: client }
    ])

    // We can safely expose this to client.
    extendViteConfig((config) => {
      config.define = config.define || {}
      config.define['process.env.NEXTAUTH_URL'] = JSON.stringify(process.env.NEXTAUTH_URL)
      config.define['process.env.NEXTAUTH_URL_INTERNAL'] = JSON.stringify(process.env.NEXTAUTH_URL_INTERNAL)
      config.define['process.env.VERCEL_URL'] = JSON.stringify(process.env.VERCEL_URL)
    })
  }
})
