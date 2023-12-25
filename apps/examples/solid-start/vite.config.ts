import solid from "solid-start/vite"
import { defineConfig } from "vite"
// @ts-expect-error no typings
import vercel from "solid-start-vercel"

export default defineConfig(() => {
  return {
    plugins: [solid({ ssr: true, adapter: vercel({ edge: false }) })],
  }
})
