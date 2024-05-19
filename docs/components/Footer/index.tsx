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
        "flex flex-col sm:gap-12 gap-4 px-12 items-center pb-20 pt-24 mx-auto w-full text-gray-600 dark:text-gray-100",
        className
      )}
    >
      <div className="flex flex-col gap-6 justify-between w-full sm:flex-row sm:gap-0 max-w-[90rem]">
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
                className="flex gap-1 items-center text-current"
                target="_blank"
                rel="noopener noreferrer"
                title="vercel.com homepage"
                href="https://vercel.com?utm_source=authjs&utm_campaign=oss"
              >
                <span>Powered by</span>
                <svg height={20} viewBox="0 0 283 64" fill="none">
                  <title>Vercel</title>
                  <path
                    fill="currentColor"
                    d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                  />
                </svg>
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
            <a href="/sponsors">Sponsors</a>
          </ul>
        </div>
      </div>
      <div className="flex-grow mx-auto mt-4 text-gray-400 sm:mt-0 dark:text-gray-500">
        Auth.js &copy; Balázs Orbán and Team - {new Date().getFullYear()}
      </div>
    </div>
  )
}

export default Footer
