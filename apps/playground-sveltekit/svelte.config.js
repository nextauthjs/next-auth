import adapter from "@sveltejs/adapter-node" // or use https://github.com/sveltejs/kit/tree/master/packages/adapter-auto
import preprocess from "svelte-preprocess"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
  },
}

export default config
