import Link from "next/link"
import Image from "next/image"
import { RichTabs } from "@/components/RichTabs"
import React, { useEffect, useState } from "react"
import { addClassToHast, codeToHtml } from "shiki"
import { Framework, frameworkDetails } from "utils/frameworks"
import SvelteKit from "../../public/img/etc/sveltekit.svg"
import Express from "../../public/img/etc/express.svg"
import NextJs from "../../public/img/etc/nextjs.svg"
import { CaretRight } from "@phosphor-icons/react/dist/csr/CaretRight"

async function renderNextJs(framework: Framework) {
  const tailwindDarkMode = document.documentElement.classList.contains("dark")

  return codeToHtml(frameworkDetails[framework].code, {
    lang: "ts",
    theme: tailwindDarkMode ? "catppuccin-mocha" : "catppuccin-latte",
    transformers: [
      {
        pre(node) {
          addClassToHast(
            node,
            "w-full h-full !px-2 !py-4 rounded-md overflow-x-scroll"
          )
        },
      },
    ],
  })
}

export function FrameworkExamples() {
  const [active, setActive] = useState<Framework>(Framework.NextJs)
  const [example, setExample] = useState("")

  useEffect(() => {
    renderNextJs(active)
      .then((code) => setExample(code))
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
  }, [active])

  function handleTabChange(value: Framework) {
    setActive(value)
  }

  return (
    <RichTabs
      onTabChange={handleTabChange}
      orientation="horizontal"
      defaultValue="nextjs"
      className="w-full flex flex-col !py-8 md:!py-16 !m-0 max-w-2xl lg:self-start"
    >
      <RichTabs.List className="justify-between p-2 bg-white rounded-t-lg shadow-md backdrop-blur dark:bg-neutral-950/40">
        <div className="flex gap-2">
          <RichTabs.Trigger
            value="nextjs"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 dark:bg-neutral-800 bg-gray-200 !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300"
          >
            <Image
              width="24"
              src={NextJs}
              alt="Next.js Logo"
              className="dark:invert"
            />
            <span className="hidden md:block">Next.js</span>
          </RichTabs.Trigger>
          <RichTabs.Trigger
            value="sveltekit"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 dark:bg-neutral-800 bg-gray-200 !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300"
          >
            <Image width="24" src={SvelteKit} alt="SvelteKit Logo" />
            <span className="hidden md:block">SvelteKit</span>
          </RichTabs.Trigger>
          <RichTabs.Trigger
            value="express"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 dark:bg-neutral-800 bg-gray-200 !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300"
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
            className="!border-0 aria-selected:!bg-violet-600 aria-selected:dark:!bg-violet-900 dark:bg-neutral-900 bg-gray-200 !h-auto !w-auto !flex-row !gap-2 !justify-start p-2 px-3 rounded-md outline-none transition-all duration-300 flex gap-2 items-center"
          >
            <span className="hidden md:block">More</span>
            <CaretRight />
          </Link>
        </div>
        <div className="inline-flex gap-2 items-center self-end pr-4 h-12">
          <div className="bg-green-300 rounded-full size-4"></div>
          <div className="bg-amber-300 rounded-full size-4"></div>
          <div className="bg-red-300 rounded-full size-4"></div>
        </div>
      </RichTabs.List>
      <div className="p-2 pt-0 w-full bg-white rounded-b-lg shadow-md backdrop-blur dark:bg-neutral-950/30">
        <RichTabs.Content
          orientation="vertical"
          value="nextjs"
          className="h-full"
          tabIndex={-1}
        >
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: example }}
          />
        </RichTabs.Content>
        <RichTabs.Content
          value="sveltekit"
          className="h-full"
          tabIndex={-1}
          orientation="vertical"
        >
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: example }}
          />
        </RichTabs.Content>
        <RichTabs.Content
          value="express"
          className="h-full"
          tabIndex={-1}
          orientation="vertical"
        >
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: example }}
          />
        </RichTabs.Content>
      </div>
    </RichTabs>
  )
}
