import { useEffect, useState } from "react"
import { createHighlighter, Highlighter } from "shiki/index.mjs"

const codeSnippet = `import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
})`

export default function Advantages() {
  const [highlighter, setHighlighter] = useState<Highlighter[] | null>([])

  useEffect(() => {
    ;(async () => {
      const hl = await createHighlighter({
        themes: ["github-light-default", "github-light-default"],
        langs: ["ts", "tsx", "bash"],
      })
      const h2 = await createHighlighter({
        themes: ["github-dark", "github-dark"],
        langs: ["ts", "tsx", "bash"],
      })
      setHighlighter([hl, h2])
    })()
  }, [])

  const highlightLight = (code: string, lang: "ts" | "tsx" | "bash") => {
    if (!highlighter || highlighter.length !== 2) {
      return `<pre><code>${code}</code></pre>`
    }

    return highlighter[0].codeToHtml(code, {
      lang,
      themes: {
        light: "github-light-default",
        dark: "github-light-default",
      },
    })
  }

  const highlightDark = (code: string, lang: "ts" | "tsx" | "bash") => {
    if (!highlighter || highlighter.length !== 2) {
      return `<pre><code>${code}</code></pre>`
    }
    return highlighter[1].codeToHtml(code, {
      lang,
      themes: {
        light: "github-dark",
        dark: "github-dark",
      },
    })
  }

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 sm:py-24 dark:bg-neutral-950">
      <div className="absolute left-1/2 top-1/2 -z-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 opacity-50 blur-[256px] dark:bg-violet-900/20" />
      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="flex flex-col items-center gap-16">
          <div className="flex max-w-2xl flex-col items-center gap-4">
            <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
              Everything you need, nothing you don’t
            </h2>
            <div className="text-center text-lg text-neutral-600 dark:text-neutral-400">
              Auth.js is a complete, open-source authentication solution,
              designed to be flexible and secure, giving you full control over
              your user data.
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="flex h-full flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-100 p-8 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex justify-start text-black dark:text-white">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Use Any Framework
                </h3>
                <div className="text-lg text-neutral-600 dark:text-neutral-400">
                  Built for the edge with first-class support for Next.js,
                  SvelteKit, SolidStart, and more.
                </div>
              </div>

              <div className="flex h-full flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-100 p-8 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex justify-start text-black dark:text-white">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7M4 7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2M4 7l8 5 8-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Own Your Data
                </h3>
                <div className="text-lg text-neutral-600 dark:text-neutral-400">
                  Connect to your own database with our adapter system. Never
                  get locked into a vendor's user table again.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-100 p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex justify-start text-black dark:text-white">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3H5a2 2 0 00-2 2v5m7-7h5a2 2 0 012 2v5m-7 11h5a2 2 0 002-2v-5m-7 7H5a2 2 0 01-2-2v-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Fully Extensible
              </h3>
              <div className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
                Choose from 100+ pre-configured providers or add your own.
                Customize everything from UI to session handling with callbacks.
              </div>
              <div className="mt-auto rounded-lg border border-neutral-200 bg-[#FFF4] px-4 font-mono text-sm dark:border-neutral-800 dark:bg-[#FFFFFF03]">
                <div className="py-4">
                  {/* 3. Render the highlighted HTML using dangerouslySetInnerHTML */}
                  <div
                    className="dark:hidden [&>*]:!bg-transparent [&_*]:whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightLight(codeSnippet, "ts"),
                    }}
                  />
                  <div
                    className="hidden dark:block [&>*]:!bg-transparent [&_*]:whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightDark(codeSnippet, "ts"),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
