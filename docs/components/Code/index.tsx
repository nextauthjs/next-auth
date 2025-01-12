import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useThemeConfig } from "nextra-theme-docs"
import { Tabs } from "nextra/components"
import React, { Children, useEffect, MouseEvent, useState } from "react"

interface ChildrenProps {
  children: React.ReactNode
}

const AUTHJS_TAB_KEY = "authjs.codeTab.framework"

Code.Next = NextCode
Code.NextClient = NextClientCode
Code.Svelte = SvelteCode
// Code.Solid = SolidCode;
Code.Express = ExpressCode
Code.Qwik = QwikCode

const baseFrameworks = {
  [NextCode.name]: "Next.js",
  [QwikCode.name]: "Qwik",
  [SvelteCode.name]: "SvelteKit",
  [ExpressCode.name]: "Express",
  // [SolidCode.name]: "SolidStart",
}

const allFrameworks = {
  [NextCode.name]: "Next.js",
  [NextClientCode.name]: "Next.js (Client)",
  [QwikCode.name]: "Qwik",
  [SvelteCode.name]: "SvelteKit",
  // [SolidCode.name]: "SolidStart",
  [ExpressCode.name]: "Express",
}

/**
 * Replace all non-alphabetic characters with a hyphen
 *
 * @param url - URL to parse
 * @returns - A string parsed from the URL
 */
const parseParams = (url: string): string => {
  let parsedUrl = url.toLowerCase().replaceAll(/[^a-zA-z]+/g, "-")
  return parsedUrl.endsWith("-") ? parsedUrl.slice(0, -1) : parsedUrl
}

export function Code({ children }: ChildrenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childs = Children.toArray(children)
  const { project } = useThemeConfig()

  const withNextJsPages = childs.some(
    // @ts-expect-error: Hacky dynamic child wrangling
    (p) => p && p.type.name === NextClientCode.name
  )

  const renderedFrameworks = withNextJsPages ? allFrameworks : baseFrameworks

  const [selectedFramework, setSelectedFramework] = useState<string>(
    Object.values(renderedFrameworks)[0]
  )

  const updateFrameworkStorage = (value: string): void => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("framework", value)
    router.push(`${router.pathname}?${params.toString()}`)
  }

  const handleFrameworkChange = (framework: string) => {
    window.localStorage.setItem(AUTHJS_TAB_KEY, framework)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: AUTHJS_TAB_KEY,
        newValue: framework,
      })
    )
    updateFrameworkStorage(parseParams(framework))
  }

  const handleClickFramework = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return
    const { textContent } = event.target as unknown as HTMLDivElement
    if (textContent) {
      handleFrameworkChange(textContent)
    }
  }

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (
        event.key === AUTHJS_TAB_KEY &&
        event.newValue &&
        Object.values(renderedFrameworks).includes(event.newValue)
      ) {
        setSelectedFramework(event.newValue)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  useEffect(() => {
    const getFrameworkStorage = window.localStorage.getItem(AUTHJS_TAB_KEY)
    if (!getFrameworkStorage) {
      handleFrameworkChange(Object.values(renderedFrameworks)[0])
    } else if (
      Object.values(renderedFrameworks).includes(getFrameworkStorage)
    ) {
      setSelectedFramework(getFrameworkStorage)
      updateFrameworkStorage(parseParams(getFrameworkStorage))
    }
  }, [router.pathname, renderedFrameworks])

  return (
    <div
      className="[&_div[role='tablist']]:!pb-0"
      onClick={handleClickFramework}
    >
      <Tabs
        selectedIndex={Object.values(renderedFrameworks).indexOf(
          selectedFramework
        )}
        items={Object.values(renderedFrameworks)}
      >
        {Object.keys(renderedFrameworks).map((f) => {
          // @ts-expect-error: Hacky dynamic child wrangling
          const child = childs.find((c) => c?.type?.name === f)

          // @ts-expect-error: Hacky dynamic child wrangling
          return Object.keys(child?.props ?? {}).length ? (
            child
          ) : (
            <Tabs.Tab key={f}>
              <p className="rounded-lg bg-slate-100 p-6 font-semibold dark:bg-neutral-950">
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

function QwikCode({ children }: ChildrenProps) {
  return <Tabs.Tab>{children}</Tabs.Tab>
}
