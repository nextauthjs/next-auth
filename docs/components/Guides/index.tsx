import {
  ShieldStar,
  CaretRight,
  Link as LinkIcon,
  ArrowRight,
  Browser,
  GithubLogo,
} from "@/icons"
import Link from "next/link"
import Image from "next/image"

export function Guides() {
  return (
    <section className="flex items-center justify-center overflow-hidden bg-neutral-100 pb-12 pt-24 dark:bg-neutral-950">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-10 lg:flex-row lg:items-start">
        <div className="flex w-full max-w-2xl flex-1 flex-col items-start justify-start px-8 lg:px-0">
          <div className="mb-10 flex w-full items-center justify-between">
            <h2 className="text-2xl lg:text-3xl">Highlighted Guides</h2>
            <Link
              href="/guides/configuring-oauth-providers"
              className="flex items-center gap-2 text-[#289ef9]"
            >
              See all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="w-full list-none">
            <Link href="/guides/configuring-oauth-providers">
              <li className="group mb-8 flex w-full justify-between">
                <div className="flex gap-2">
                  <ShieldStar className="size-8" />
                  <div className="flex flex-col items-start">
                    Configuring OAuth providers
                    <span className="text-neutral-400 dark:text-neutral-700">
                      Customize a built-in one or set up your own.
                    </span>
                  </div>
                </div>
                <div className="opacity-0 transition duration-300 group-hover:opacity-100">
                  <CaretRight className="size-6" />
                </div>
              </li>
            </Link>
            <Link href="/guides/configuring-github">
              <li className="group mb-8 flex w-full justify-between">
                <div className="flex gap-2">
                  <GithubLogo className="size-8" />
                  <div className="flex flex-col items-start">
                    OAuth with GitHub
                    <span className="text-neutral-400 dark:text-neutral-700">
                      Step-by-step guide to set up an OAuth provider.
                    </span>
                  </div>
                </div>
                <div className="opacity-0 transition duration-300 group-hover:opacity-100">
                  <CaretRight className="size-6" />
                </div>
              </li>
            </Link>
            <Link href="/guides/pages/signin">
              <li className="group mb-8 flex w-full justify-between">
                <div className="flex gap-2">
                  <Browser className="size-8" />
                  <div className="flex flex-col items-start">
                    Custom Signin Page
                    <span className="text-neutral-400 dark:text-neutral-700">
                      Create a page that matches your app's design.
                    </span>
                  </div>
                </div>
                <div className="opacity-0 transition duration-300 group-hover:opacity-100">
                  <CaretRight className="size-6" />
                </div>
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex w-full max-w-2xl flex-1 flex-col items-start justify-start px-8 lg:mx-0">
          <div className="mb-10 flex w-full items-center justify-between">
            <h2 className="text-2xl lg:text-3xl">Example Apps</h2>
          </div>
          <ul className="w-full list-none">
            {[
              {
                id: "nextjs",
                name: "Next.js",
                demo: "https://next-auth-example.vercel.app",
                repo: "next-auth-example",
              },
              {
                id: "sveltekit",
                name: "SvelteKit",
                demo: "https://sveltekit-auth-example.vercel.app",
                repo: "sveltekit-auth-example",
              },
              {
                id: "express",
                name: "Express",
                demo: "https://express-auth-example.vercel.app",
                repo: "express-auth-example",
              },
              {
                id: "qwik",
                name: "Qwik",
                demo: "https://qwik-auth-example.vercel.app",
                repo: "qwik-auth-example",
              },
              {
                id: "solidstart",
                name: "SolidStart",
                demo: "https://solid-start-auth-example.vercel.app",
                repo: "solid-start-auth-example",
              },
            ].map((f) => (
              <li
                key={f.id}
                className="mb-8 flex w-full flex-col justify-between gap-4 p-2 grayscale transition duration-300 hover:grayscale-0 sm:flex-row"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={`/img/etc/${f.id}.svg`}
                    className={
                      f.id === "express" || f.id === "nextjs"
                        ? "dark:invert"
                        : ""
                    }
                    height="32"
                    width="32"
                    alt={`${f.name} Logo`}
                  />
                  {f.name}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    className="flex items-center justify-center gap-2 rounded-md bg-neutral-200 p-3 px-5 outline-none transition duration-300 hover:bg-neutral-300 focus-visible:ring-2 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                    target="_blank"
                    href={f.demo}
                    rel="noreferrer"
                  >
                    <LinkIcon className="size-5" />
                    Visit
                  </Link>
                  <Link
                    target="_blank"
                    href={`https://github.com/nextauthjs/${f.repo}`}
                    className="flex items-center justify-center gap-2 rounded-md bg-neutral-200 p-3 px-5 outline-none transition duration-300 hover:bg-neutral-300 focus-visible:ring-2 dark:bg-neutral-800 hover:dark:bg-neutral-700"
                    rel="noreferrer"
                  >
                    <GithubLogo className="size-5" />
                    Clone
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
