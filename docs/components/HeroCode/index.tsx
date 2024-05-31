import Link from "next/link"
import Image from "next/image"
import { RichTabs } from "@/components/RichTabs"
import SvelteKit from "../../public/img/etc/sveltekit.svg"
import Express from "../../public/img/etc/express.svg"
import Next from "../../public/img/etc/nextjs.svg"
import { CaretRight } from "@/icons"

export function HeroCode({ children }) {
  return (
    <RichTabs
      orientation="horizontal"
      tabKey="hero"
      defaultValue="nextjs"
      className="w-full flex flex-col !py-8 md:!py-16 !m-0 max-w-xl xl:max-w-2xl lg:self-start"
    >
      <RichTabs.List className="justify-between p-2 rounded-t-lg bg-white/40 backdrop-blur dark:bg-neutral-950/25">
        <div className="flex gap-2">
          <RichTabs.Trigger
            value="nextjs"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 aria-selected:!text-white dark:bg-neutral-800 bg-white !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300 hover:bg-violet-200 hover:dark:bg-violet-900/20 !font-normal"
          >
            <Image
              width="24"
              src={Next}
              alt="Next.js"
              className="dark:invert"
            />
            <span className="hidden md:block">Next.js</span>
          </RichTabs.Trigger>
          <RichTabs.Trigger
            value="sveltekit"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 aria-selected:!text-white dark:bg-neutral-800 bg-white !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300 hover:bg-violet-200 hover:dark:bg-violet-900/20 !font-normal"
          >
            <Image width="24" src={SvelteKit} alt="SvelteKit Logo" />
            <span className="hidden md:block">SvelteKit</span>
          </RichTabs.Trigger>
          <RichTabs.Trigger
            value="express"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 aria-selected:!text-white dark:bg-neutral-800 bg-white !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300 hover:bg-violet-200 hover:dark:bg-violet-900/20 !font-normal"
          >
            <Image
              width="24"
              src={Express}
              alt="Express Logo"
              className="dark:invert"
            />
            <span className="hidden md:block">Express</span>
          </RichTabs.Trigger>
          <Link
            href="/getting-started/integrations"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 dark:bg-neutral-900 bg-white !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300 flex items-center hover:bg-violet-200 hover:dark:bg-violet-900/20"
          >
            <span className="hidden text-sm md:block">More</span>
            <CaretRight className="size-4" />
          </Link>
        </div>
        <div className="inline-flex gap-2 items-center self-end pr-4 h-12">
          <div className="bg-green-300 rounded-full size-4"></div>
          <div className="bg-amber-300 rounded-full size-4"></div>
          <div className="bg-red-300 rounded-full size-4"></div>
        </div>
      </RichTabs.List>
      <div className="p-2 pt-0 w-full rounded-b-lg shadow-md bg-white/40 backdrop-blur dark:bg-neutral-950/25 [&_div]:border-0 [&_div]:shadow-none [&>div.h-full>div>div>pre]:dark:!bg-neutral-950/60 [&>div.h-full>div>div>pre]:!bg-white/60">
        {NextCode({ children })}
        {SvelteCode({ children })}
        {ExpressCode({ children })}
      </div>
    </RichTabs>
  )
}

HeroCode.Next = NextCode
HeroCode.Svelte = SvelteCode
HeroCode.Express = ExpressCode

function NextCode({ children }) {
  return (
    <RichTabs.Content
      orientation="vertical"
      value="nextjs"
      className="h-full"
      tabIndex={-1}
    >
      {children}
    </RichTabs.Content>
  )
}

function SvelteCode({ children }) {
  return (
    <RichTabs.Content
      orientation="vertical"
      value="sveltekit"
      className="h-full"
      tabIndex={-1}
    >
      {children}
    </RichTabs.Content>
  )
}

function ExpressCode({ children }) {
  return (
    <RichTabs.Content
      orientation="vertical"
      value="express"
      className="h-full"
      tabIndex={-1}
    >
      {children}
    </RichTabs.Content>
  )
}
