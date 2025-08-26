import React from "react"
import manifest from "@/data/manifest.json"

const providersOAuth = manifest.providersOAuth
const providers = Object.keys(providersOAuth)

const quarter = Math.ceil(providers.length / 4)
const row1 = providers.slice(0, quarter)
const row2 = providers.slice(quarter, quarter * 2)
const row3 = providers.slice(quarter * 2, quarter * 3)
const row4 = providers.slice(quarter * 3)

const ProviderIcon = ({ name }) => (
  <div className="group relative mx-3 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border border-black/5 bg-black/10 backdrop-blur-sm lg:mx-4 lg:h-32 lg:w-32 dark:border-white/10 dark:bg-white/5">
    <img
      src={`../img/providers/${name}.svg`}
      alt={name}
      className="dark:filter-white h-8 w-8 lg:h-12 lg:w-12"
      onError={(e) => {
        ;(e.currentTarget as HTMLImageElement).style.display = "none"
      }}
    />
    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
      <div className="whitespace-nowrap rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200">
        {providersOAuth[name]}
      </div>
      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-neutral-700"></div>
    </div>
  </div>
)

const ProviderMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden py-16">
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="animate-scroll-left flex min-w-full flex-shrink-0">
          {row1.map((name, i) => (
            <ProviderIcon key={`r1-${i}`} name={name} />
          ))}
          {row1.map((name, i) => (
            <ProviderIcon key={`r1-dup-${i}`} name={name} />
          ))}
        </div>

        <div className="animate-scroll-right flex min-w-full flex-shrink-0">
          {row2.map((name, i) => (
            <ProviderIcon key={`r2-${i}`} name={name} />
          ))}
          {row2.map((name, i) => (
            <ProviderIcon key={`r2-dup-${i}`} name={name} />
          ))}
        </div>

        <div className="animate-scroll-left flex min-w-full flex-shrink-0">
          {row3.map((name, i) => (
            <ProviderIcon key={`r3-${i}`} name={name} />
          ))}
          {row3.map((name, i) => (
            <ProviderIcon key={`r3-dup-${i}`} name={name} />
          ))}
        </div>

        <div className="animate-scroll-right flex min-w-full flex-shrink-0">
          {row4.map((name, i) => (
            <ProviderIcon key={`r4-${i}`} name={name} />
          ))}
          {row4.map((name, i) => (
            <ProviderIcon key={`r4-dup-${i}`} name={name} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProviderMarquee
