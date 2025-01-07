import { Link } from "@/components/Link"
import { Flask } from "@/icons/Flask"
import { ArrowSquareOut } from "@/icons/ArrowSquareOut"
import { GithubLogo } from "@/icons/GithubLogo"

interface FrameworkLinkProps {
  id: string
  name: string
  demo: string
  repo: string
  isExperimental?: boolean
  isInvert?: boolean
}

export function FrameworkLink({
  id,
  name,
  demo,
  repo,
  isExperimental = true,
  isInvert = false,
}: FrameworkLinkProps) {
  return (
    <div className="group flex flex-col gap-2">
      <Link
        href={`/getting-started?framework=${name}`}
        className="relative flex h-28 w-28 flex-col flex-wrap items-center justify-between rounded-lg border border-solid border-neutral-200 bg-white p-4 !no-underline shadow-sm transition-colors duration-300 hover:bg-neutral-100 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-950"
      >
        <img
          alt={`${name} Logo`}
          src={`/img/etc/${id}.svg`}
          width="40"
          className={isInvert ? "dark:invert" : ""}
        />
        <div className="mt-3 text-sm">{name}</div>
        {isExperimental && (
          <div
            className="absolute z-10 rounded-full bg-amber-300 p-2 text-sm font-semibold text-black shadow-sm"
            style={{ right: "-20px", top: "-15px" }}
          >
            <Flask className="size-6" />
          </div>
        )}
      </Link>
      <div className="flex justify-stretch gap-2">
        <a
          title="Live Example"
          href={demo}
          rel="noreferrer"
          target="_blank"
          className="flex w-full justify-center rounded-md border border-neutral-200/50 bg-neutral-100 p-2 text-sm dark:border-neutral-800/30 dark:bg-neutral-900"
        >
          <ArrowSquareOut className="size-5" />
        </a>
        <a
          title="GitHub Repository"
          href={repo}
          rel="noreferrer"
          target="_blank"
          className="flex w-full justify-center rounded-md border border-neutral-200/50 bg-neutral-100 p-2 text-sm dark:border-neutral-800/30 dark:bg-neutral-900"
        >
          <GithubLogo className="size-5" />
        </a>
      </div>
    </div>
  )
}
