import ProvidersMarquee from "./Marquee"

export default function Providers() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden py-12">
      <div className="z-10 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
          Sign in with <span className="italic">anything</span>
        </h2>
        <div className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          With over 100 popular providers, you can let your users sign in with
          the services they already use and trust.
        </div>
      </div>

      <ProvidersMarquee />
    </section>
  )
}
