import { useEffect } from "react"
import { useRouter } from "next/router"
import cx from "classnames"

function kFormatter(num: number) {
  return (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + "k"
}

export function Footer({ className = "" }) {
  const router = useRouter()

  useEffect(() => {
    fetch("https://api.github.com/repos/nextauthjs/next-auth")
      .then((res) => res.json())
      .then((data) => {
        const githubStat = document.querySelector(".github-counter")!
        if (!githubStat) return
        githubStat.innerHTML = kFormatter(data.stargazers_count ?? 21100)
      })

    // CarbonAds hydration error workaround hack
    const carbonAdsEl =
      document.querySelector<HTMLScriptElement>("#_carbonads_js")
    if (carbonAdsEl) {
      carbonAdsEl.src =
        "https://cdn.carbonads.com/carbon.js?serve=CWYD42JY&placement=authjsdev&format=cover"

      router.events.on("routeChangeComplete", () => {
        window._carbonads?.refresh()
      })
    }
  }, [])
  return (
    <div
      className={cx(
        "mx-auto flex w-full flex-col items-center gap-4 px-12 pb-20 pt-24 text-gray-600 sm:gap-12 dark:text-gray-100",
        className
      )}
    >
      <div className="flex w-full max-w-[90rem] flex-col justify-between gap-6 sm:flex-row sm:gap-0">
        <div className="flex flex-col">
          <h3 className="mb-4 text-lg font-black">About Auth.js</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/getting-started">Introduction</a>
            </li>
            <li>
              <a href="/security">Security</a>
            </li>
            <li>
              <a
                href="https://discord.authjs.dev/?utm_source=docs"
                title="Join our Discord"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
                target="_blank"
              >
                Discord Community
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-4 text-lg font-black">Download</h3>
          <ul className="flex flex-col gap-2">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/nextauthjs/next-auth"
            >
              GitHub
            </a>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.npmjs.com/package/next-auth"
            >
              NPM
            </a>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-4 text-lg font-black">Acknowledgements</h3>
          <ul className="flex flex-col gap-2">
            <a href="/contributors">Contributors</a>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-4 flex-grow text-gray-400 sm:mt-0 dark:text-gray-500">
        Auth.js &copy; Better Auth Inc. - {new Date().getFullYear()}
      </div>
    </div>
  )
}

export default Footer
