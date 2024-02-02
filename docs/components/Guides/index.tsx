import {
  CaretRight,
  Link as LinkIcon,
  ShieldStar,
  Browser,
  GithubLogo,
  ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

export function Guides() {
  return (
    <section className="flex overflow-hidden justify-center items-center pt-24 pb-12 bg-neutral-100 dark:bg-neutral-950">
      <div className="flex flex-col gap-10 justify-between items-center w-full max-w-5xl lg:flex-row lg:items-start">
        <div className="flex flex-col flex-1 justify-start items-start px-8 w-full max-w-2xl lg:px-0">
          <div className="flex justify-between items-center mb-10 w-full">
            <h2 className="text-2xl lg:text-3xl">Highlighted Guides</h2>
            <Link
              href="/docs"
              className="flex gap-2 items-center text-[#289ef9]"
            >
              See all
              <ArrowRight size={14} />
            </Link>
          </div>
          <ul className="w-full list-none">
            <Link href="/guides/configuring-oauth">
              <li className="flex justify-between mb-8 w-full group">
                <div className="flex gap-2">
                  <ShieldStar size={32} />
                  <div className="flex flex-col items-start">
                    Configuring OAuth providers
                    <span className="text-neutral-400 dark:text-neutral-700">
                      Customize to a built-in one or set up your own.
                    </span>
                  </div>
                </div>
                <div className="opacity-0 transition duration-300 group-hover:opacity-100">
                  <CaretRight size={32} className="" />
                </div>
              </li>
            </Link>
            <Link href="/guides/deep-dive/oauth-github-setup">
              <li className="flex justify-between mb-8 w-full group">
                <div className="flex gap-2">
                  <GithubLogo size={32} />
                  <div className="flex flex-col items-start">
                    OAuth with Github
                    <span className="text-neutral-400 dark:text-neutral-700">
                      Step-by-step guide to set up an OAuth provider.
                    </span>
                  </div>
                </div>
                <div className="opacity-0 transition duration-300 group-hover:opacity-100">
                  <CaretRight size={32} className="" />
                </div>
              </li>
            </Link>
            <Link href="/guides/custom-pages/custom-sign-in">
              <li className="flex justify-between mb-8 w-full group">
                <div className="flex gap-2">
                  <Browser size={32} />
                  <div className="flex flex-col items-start">
                    Custom Signin Page
                    <span className="text-neutral-400 dark:text-neutral-700">
                      Create a page that matches your app's design.
                    </span>
                  </div>
                </div>
                <div className="opacity-0 transition duration-300 group-hover:opacity-100">
                  <CaretRight size={32} className="" />
                </div>
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex flex-col flex-1 justify-start items-start px-8 w-full max-w-2xl lg:mx-0">
          <div className="flex justify-between items-center mb-10 w-full">
            <h2 className="text-2xl lg:text-3xl">Example Apps</h2>
            {/* <Link
              href="#TODO"
              className="flex gap-2 items-center text-[#289ef9]"
            >
              See all
              <ArrowRight size={14} />
            </Link> */}
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
            ].map((f) => (
              <li
                key={f.id}
                className="flex justify-between items-center p-2 mb-8 w-full transition duration-300 grayscale hover:grayscale-0"
              >
                <div className="flex gap-2 items-center">
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
                <div className="flex gap-4">
                  <Link
                    className="flex gap-2 items-center p-2 px-4 rounded-md transition duration-300 outline-none focus-visible:ring-2 bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700 hover:bg-neutral-300"
                    target="_blank"
                    href={f.demo}
                    rel="noreferrer"
                  >
                    <LinkIcon size={28} />
                    Visit
                  </Link>
                  <Link
                    target="_blank"
                    href={`https://github.com/nextauthjs/${f.repo}`}
                    className="flex gap-2 items-center p-2 px-4 rounded-md transition duration-300 outline-none focus-visible:ring-2 bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700 hover:bg-neutral-300"
                    rel="noreferrer"
                  >
                    <GithubLogo size={28} />
                    Clone
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
