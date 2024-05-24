import { useThemeConfig } from "nextra-theme-docs"
import { useRouter } from "next/router"
import { Tabs } from "nextra/components"
import React, { Children, ReactNode, useEffect, useState } from "react"

interface ChildrenProps {
  children: ReactNode
}

const AUTHJS_TAB_KEY = "authjs.codeTab.framework"

Code.Next = NextCode
Code.NextClient = NextClientCode
Code.Svelte = SvelteCode
// Code.Solid = SolidCode;
Code.Express = ExpressCode
Code.Fastify = FastifyCode

const baseFrameworks = {
  [NextCode.name]: "Next.js",
  [SvelteCode.name]: "SvelteKit",
  [ExpressCode.name]: "Express",
  // [SolidCode.name]: "SolidStart",
  [FastifyCode.name]: "Fastify",
}

const allFrameworks = {
  [NextCode.name]: "Next.js",
  [NextClientCode.name]: "Next.js (Client)",
  [SvelteCode.name]: "SvelteKit",
  // [SolidCode.name]: "SolidStart",
  [ExpressCode.name]: "Express",
}

const findTabIndex = (frameworks: Record<string, string>, tab: string) => {
  // TODO: Slugify instead of matching on indexes
  return Object.values(frameworks).findIndex(
    (f) => f.toLowerCase() === tab.toLowerCase()
  )
}

export function Code({ children }: ChildrenProps) {
  const router = useRouter()
  const {
    query: { framework },
  } = router
  const childs = Children.toArray(children)
  const { project } = useThemeConfig()

  const withNextJsPages = childs.some(
    // @ts-expect-error: Hacky dynamic child wrangling
    (p) => p && p.type.name === NextClientCode.name
  )

  const renderedFrameworks = withNextJsPages ? allFrameworks : baseFrameworks
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const savedTabPreference = Number(
      window.localStorage.getItem(AUTHJS_TAB_KEY)
    )
    if (framework) {
      window.localStorage.setItem(
        AUTHJS_TAB_KEY,
        String(findTabIndex(renderedFrameworks, framework as string))
      )
      setTabIndex(findTabIndex(renderedFrameworks, framework as string))
    } else if (savedTabPreference) {
      setTabIndex(savedTabPreference)
    }
  }, [framework, renderedFrameworks])

  return (
    <div className="[&_div[role='tablist']]:!pb-0">
      <Tabs
        storageKey={AUTHJS_TAB_KEY}
        items={Object.values(renderedFrameworks)}
        selectedIndex={tabIndex}
      >
        {Object.keys(renderedFrameworks).map((f) => {
          // @ts-expect-error: Hacky dynamic child wrangling
          const child = childs.find((c) => c?.type?.name === f)

          // @ts-expect-error: Hacky dynamic child wrangling
          return Object.keys(child?.props ?? {}).length ? (
            child
          ) : (
            <Tabs.Tab key={f}>
              <p className="p-6 font-semibold rounded-lg bg-slate-100 dark:bg-neutral-950">
                {renderedFrameworks[f]} not documented yet. Help us by
                contributing{" "}
                <a
                  className="underline"
                  target="_blank"
                  href={`${project.link}/edit/main/docs/pages${router.pathname}.mdx`}
                  rel="noreferrer"
                >
                  here
                </a>
                .
              </p>
            </Tabs.Tab>
          )
        })}
      </Tabs>
    </div>
  )
}

function NextClientCode({ children }: ChildrenProps) {
  return <Tabs.Tab>{children}</Tabs.Tab>
}

function NextCode({ children }: ChildrenProps) {
  return <Tabs.Tab>{children}</Tabs.Tab>
}

function SvelteCode({ children }: ChildrenProps) {
  return <Tabs.Tab>{children}</Tabs.Tab>
}

// function SolidCode({ children }: ChildrenProps) {
//   return <Tabs.Tab>{children}</Tabs.Tab>;
// }

function ExpressCode({ children }: ChildrenProps) {
  return <Tabs.Tab>{children}</Tabs.Tab>
}

function FastifyCode({ children }: ChildrenProps) {
  return <Tabs.Tab>{children}</Tabs.Tab>
}
