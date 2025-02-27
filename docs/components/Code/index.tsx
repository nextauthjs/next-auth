import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useThemeConfig } from "nextra-theme-docs"
import { Tabs } from "nextra/components"
import React, { Children, useEffect, MouseEvent } from "react"

interface ChildrenProps {
  children: React.ReactNode
}

const AUTHJS_TAB_KEY = "authjs.codeTab.framework"
const AUTHJS_TAB_KEY_ALL = "authjs.codeTab.framework.all"

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

const findFrameworkKey = (
  text: string,
  frameworks: Record<string, string>
): string | null => {
  const entry = Object.entries(frameworks).find(([_, value]) => value === text)
  return entry ? entry[0] : null
}

const getIndexFrameworkFromUrl = (
  url: string,
  frameworks: Record<string, string>
): number | null => {
  const params = new URLSearchParams(url)
  const paramValue = params.get("framework")
  if (!paramValue) return null

  const pascalCase = paramValue.replace(
    /(^|-)([a-z])/g,
    (_, _separator, letter) => letter.toUpperCase()
  )

  const index = Object.keys(frameworks).findIndex((key) => key === pascalCase)
  return index === -1 ? null : index
}

const getIndexFrameworkFromStorage = (
  frameworks: Record<string, string>,
  isAllFrameworks: boolean
): number | null => {
  const storageKey = isAllFrameworks ? AUTHJS_TAB_KEY_ALL : AUTHJS_TAB_KEY
  const storedIndex = window.localStorage.getItem(storageKey)

  if (!storedIndex) {
    return null
  }

  return parseInt(storedIndex) % Object.keys(frameworks).length
}

const updateFrameworkStorage = (
  frameworkKey: string,
  frameworks: Record<string, string>,
  isAllFrameworks: boolean
): void => {
  const index = Object.keys(frameworks).findIndex((key) => key === frameworkKey)
  if (index === -1) return

  const storageKey = isAllFrameworks ? AUTHJS_TAB_KEY_ALL : AUTHJS_TAB_KEY
  window.localStorage.setItem(storageKey, index.toString())

  // Update other storage if framework exists in other object
  const otherFrameworksKeys = Object.keys(
    isAllFrameworks ? baseFrameworks : allFrameworks
  )
  const otherStorageKey = isAllFrameworks ? AUTHJS_TAB_KEY : AUTHJS_TAB_KEY_ALL

  const existsInOther = otherFrameworksKeys.includes(frameworkKey)
  if (existsInOther) {
    const otherIndex = otherFrameworksKeys.findIndex(
      (key) => key === frameworkKey
    )
    window.localStorage.setItem(otherStorageKey, otherIndex.toString())
    // see https://github.com/shuding/nextra/blob/7ae958f02922e608151411042f658480b75164a6/packages/nextra/src/client/components/tabs/index.client.tsx#L106
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: otherStorageKey,
        newValue: otherIndex.toString(),
      })
    )
  }
}

export function Code({ children }: ChildrenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childElements = Children.toArray(children)
  const { project } = useThemeConfig()

  const withNextJsPages = childElements.some(
    // @ts-expect-error: Hacky dynamic child wrangling
    (p) => p && p.type.name === NextClientCode.name
  )

  const renderedFrameworks = withNextJsPages ? allFrameworks : baseFrameworks

  const updateFrameworkInUrl = (frameworkKey: string): void => {
    const params = new URLSearchParams(searchParams?.toString())
    const kebabCaseValue = frameworkKey
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
    params.set("framework", kebabCaseValue)

    router.push(`${router.pathname}?${params.toString()}`, undefined, {
      scroll: false,
    })
  }

  const handleClickFramework = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return
    const { textContent } = event.target as unknown as HTMLDivElement
    if (!textContent) return

    const frameworkKey = findFrameworkKey(textContent, renderedFrameworks)
    if (frameworkKey) {
      updateFrameworkInUrl(frameworkKey)
      updateFrameworkStorage(frameworkKey, renderedFrameworks, withNextJsPages)

      // Focus and scroll to maintain position when code blocks above are expanded
      const element = event.target as HTMLButtonElement
      const rect = element.getBoundingClientRect()
      requestAnimationFrame(() => {
        element.focus()
        window.scrollBy(0, element.getBoundingClientRect().top - rect.top)
      })
    }
  }

  useEffect(() => {
    const indexFrameworkFromStorage = getIndexFrameworkFromStorage(
      renderedFrameworks,
      withNextJsPages
    )
    const indexFrameworkFromUrl = getIndexFrameworkFromUrl(
      router.asPath,
      renderedFrameworks
    )

    if (indexFrameworkFromStorage === null) {
      updateFrameworkStorage(
        Object.keys(renderedFrameworks)[indexFrameworkFromUrl ?? 0],
        renderedFrameworks,
        withNextJsPages
      )
    }

    if (!indexFrameworkFromUrl) {
      const index = indexFrameworkFromStorage ?? 0
      updateFrameworkInUrl(Object.keys(renderedFrameworks)[index])
    }
  }, [router.pathname, renderedFrameworks, withNextJsPages])

  return (
    <div
      className="[&_div[role='tablist']]:!pb-0"
      onClick={handleClickFramework}
    >
      <Tabs
        storageKey={withNextJsPages ? AUTHJS_TAB_KEY_ALL : AUTHJS_TAB_KEY}
        items={Object.values(renderedFrameworks)}
      >
        {Object.keys(renderedFrameworks).map((f) => {
          // @ts-expect-error: Hacky dynamic child wrangling
          const child = childElements.find((c) => c?.type?.name === f)

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
