export default function CTA() {
  return (
    <section className="w-full bg-white py-16 sm:py-24 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="relative isolate overflow-hidden rounded-2xl bg-violet-800/80 px-6 py-16 text-center shadow-2xl sm:rounded-3xl sm:px-16 sm:py-24">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to secure your app?
          </h2>
          <div className="mx-auto mt-6 max-w-xl text-lg leading-8 text-violet-200">
            Get started in minutes with our quickstart guide or dive into the
            documentation to see everything Auth.js has to offer.
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-x-6 gap-y-6 sm:flex-row">
            <a
              href="/getting-started"
              className="w-full rounded-md bg-white px-5 py-3.5 text-base font-semibold text-violet-800 shadow-sm transition-colors duration-300 hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Get started
            </a>
            <a
              href="/getting-started/integrations"
              className="text-base font-semibold leading-6 text-white"
            >
              See all integrations <span aria-hidden="true">→</span>
            </a>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
