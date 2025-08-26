import { GithubLogo } from "../Icons"

export default function Statistics() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-16 sm:py-24 dark:bg-black">
      <div className="absolute left-1/2 top-1/2 -z-0 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-900/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="flex flex-col items-center gap-12">
          <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
              Built by developers, for developers
            </h2>
            <div className="text-lg text-neutral-600 dark:text-neutral-400">
              Auth.js is a community-driven project, backed by a transparent,
              open-source philosophy. Your data is yours, and the code is open
              to everyone.
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-100 p-8 text-center transition-transform duration-300 hover:scale-105 hover:border-violet-700 dark:border-neutral-800 dark:bg-neutral-900/50">
              <h3 className="text-5xl font-bold text-violet-600 dark:text-violet-400">
                25k+
              </h3>
              <div className="text-xl font-semibold text-neutral-900 dark:text-white">
                GitHub Stars
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                A testament to the community's trust and love for the project.
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-100 p-8 text-center transition-transform duration-300 hover:scale-105 hover:border-violet-700 dark:border-neutral-800 dark:bg-neutral-900/50">
              <h3 className="text-5xl font-bold text-violet-600 dark:text-violet-400">
                60M+
              </h3>
              <div className="text-xl font-semibold text-neutral-900 dark:text-white">
                NPM Downloads
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Powering millions of applications every month, from side
                projects to enterprise.
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-100 p-8 text-center transition-transform duration-300 hover:scale-105 hover:border-violet-700 dark:border-neutral-800 dark:bg-neutral-900/50">
              <h3 className="text-5xl font-bold text-violet-600 dark:text-violet-400">
                900+
              </h3>
              <div className="text-xl font-semibold text-neutral-900 dark:text-white">
                Contributors
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                A massive thank you to everyone who has contributed to the
                project.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="https://discord.authjs.dev/?utm_source=docs"
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-violet-600 p-4 px-6 text-center font-semibold text-white transition duration-300 hover:bg-violet-700 dark:bg-violet-800 hover:dark:bg-violet-900"
            >
              Join the Discord
            </a>
            <a
              href="https://github.com/nextauthjs/next-auth"
              target="_blank"
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-[#FFF4] p-4 text-center font-semibold text-black backdrop-blur-sm transition max-lg:justify-center dark:border-neutral-800 dark:bg-[#FFFFFF03] dark:text-white"
            >
              <GithubLogo className="h-8 text-black dark:text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
