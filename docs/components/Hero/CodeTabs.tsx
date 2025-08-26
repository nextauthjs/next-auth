import React, { useState, useEffect } from "react"
import { type Highlighter, createHighlighter } from "shiki"
import Image from "next/image"

import { RichTabs } from "@/components/RichTabs"
import { CaretRight } from "../Icons"

// Icons
import expressIcon from "../../public/img/etc/express.svg"
import nextIcon from "../../public/img/etc/nextjs.svg"
import qwikIcon from "../../public/img/etc/qwik.svg"
import sveltekitIcon from "../../public/img/etc/sveltekit.svg"

const codeSnippets = {
  nextjs: `// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
export const { auth, handlers } = NextAuth({ providers: [GitHub] })

// middleware.ts
export { auth as middleware } from "@auth"

// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@auth"
export const { GET, POST } = handlers`,
  sveltekit: `// src/auth.ts
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from '@auth/sveltekit/providers/github'

export const { handle } = SvelteKitAuth({
  providers: [GitHub],
})

// src/hooks.server.ts
export { handle } from "./auth"`,
  express: `// server.ts
import express from "express"
import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/express/providers/github"

const app = express()

app.use("/auth/*", ExpressAuth({ providers: [GitHub] }))`,
  qwik: `// src/routes/plugin@auth.ts
import { QwikAuth } from "@auth/qwik"
import GitHub from "@auth/qwik/providers/github"
export const { onRequest, useSession } = QwikAuth$(() => ({ providers: [GitHub] }))`,
}

const ExpressIcon = () => (
  <Image
    src={expressIcon.src}
    alt="Express"
    width={24}
    height={24}
    className="dark:invert"
  />
)

const NextIcon = () => (
  <Image
    src={nextIcon.src}
    alt="Next.js"
    width={24}
    height={24}
    className="filter dark:invert"
  />
)

const QwikIcon = () => (
  <Image src={qwikIcon.src} alt="Qwik" width={24} height={24} />
)

const SvelteKitIcon = () => (
  <Image src={sveltekitIcon.src} alt="SvelteKit" width={24} height={24} />
)

export const CodeTabs = () => {
  const [activeTab, setActiveTab] = useState("nextjs")
  const [highlighter, setHighlighter] = useState<Highlighter[] | null>([])

  const tabs = [
    { value: "express", Icon: ExpressIcon, name: "Express" },
    { value: "nextjs", Icon: NextIcon, name: "Next.js" },
    { value: "qwik", Icon: QwikIcon, name: "Qwik" },
    { value: "sveltekit", Icon: SvelteKitIcon, name: "SvelteKit" },
  ]

  useEffect(() => {
    ;(async () => {
      const hl = await createHighlighter({
        themes: ["github-light-default", "github-light-default"],
        langs: ["ts", "tsx", "bash"],
      })
      const h2 = await createHighlighter({
        themes: ["github-dark", "github-dark"],
        langs: ["ts", "tsx", "bash"],
      })
      setHighlighter([hl, h2])
    })()
  }, [])

  const highlightLight = (code: string, lang: "ts" | "tsx" | "bash") => {
    if (!highlighter || highlighter.length !== 2) {
      return `<pre><code>${code}</code></pre>`
    }
    return highlighter[0].codeToHtml(code, {
      lang,
      themes: {
        light: "github-light-default",
        dark: "github-light-default",
      },
    })
  }

  const highlightDark = (code: string, lang: "ts" | "tsx" | "bash") => {
    if (!highlighter || highlighter.length !== 2) {
      return `<pre><code>${code}</code></pre>`
    }
    return highlighter[1].codeToHtml(code, {
      lang,
      themes: {
        light: "github-dark",
        dark: "github-dark",
      },
    })
  }

  return (
    <div className="w-full max-w-3xl rounded-lg border border-neutral-200 bg-[#FFF4] p-2 px-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-[#FFFFFF03]">
      <RichTabs
        defaultValue={activeTab}
        onTabChange={setActiveTab}
        tabKey="framework"
        className="mt-0 pt-0"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 pt-2 dark:border-neutral-800">
          <RichTabs.List className="gap-3">
            {tabs.map((tab) => (
              <RichTabs.Trigger
                key={tab.value}
                value={tab.value}
                className="flex max-h-10 max-w-10 items-center justify-center rounded-lg bg-[#FFF4] outline-none dark:bg-[#FFFFFF09]"
              >
                <tab.Icon />
              </RichTabs.Trigger>
            ))}
          </RichTabs.List>
          <a
            href="/getting-started/integrations"
            className="flex h-10 items-center gap-2 rounded-lg bg-[#FFF4] p-2 px-4 text-sm font-medium text-neutral-600 backdrop-blur-sm transition-colors duration-300 hover:bg-black/5 dark:bg-[#FFFFFF03] dark:text-neutral-400 hover:dark:bg-white/5"
          >
            <span>More</span>
            <CaretRight className="h-3" />
          </a>
        </div>

        {tabs.map((tab) => (
          <RichTabs.Content
            key={tab.value}
            value={tab.value}
            className="border-none py-4 shadow-none"
          >
            <div
              className="dark:hidden [&>*]:!bg-transparent [&_*]:whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: highlightLight(
                  codeSnippets[tab.value as keyof typeof codeSnippets],
                  "ts"
                ),
              }}
            />
            <div
              className="hidden dark:block [&>*]:!bg-transparent [&_*]:whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: highlightDark(
                  codeSnippets[tab.value as keyof typeof codeSnippets],
                  "ts"
                ),
              }}
            />
          </RichTabs.Content>
        ))}
      </RichTabs>
    </div>
  )
}
