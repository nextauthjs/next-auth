import { useState, useRef } from "react"
import {
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch"

export function CustomSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props)
  const { status } = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  const isSearchStalled = status === "stalled"

  function setQuery(newQuery: string) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  return (
    <form
      action=""
      role="search"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()

        if (inputRef.current) {
          inputRef.current.blur()
        }
      }}
      onReset={(event) => {
        event.preventDefault()
        event.stopPropagation()

        setQuery("")

        if (inputRef.current) {
          inputRef.current.focus()
        }
      }}
      className="relative"
    >
      <input
        ref={inputRef}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Search..."
        spellCheck={false}
        maxLength={512}
        type="search"
        value={inputValue}
        onChange={(event) => {
          setQuery(event.currentTarget.value)
        }}
        className="w-48 appearance-none rounded-lg bg-black/[.05] px-3 py-1.5 pr-2 text-base leading-tight transition-colors placeholder:text-gray-500 focus:!bg-transparent dark:bg-gray-50/10 dark:placeholder:text-gray-400 md:text-sm [aside_&]:w-full"
      />
      <div>
        {inputValue.length ? (
          <button
            type="reset"
            hidden={inputValue.length === 0 || isSearchStalled}
            className="absolute right-2 top-0 my-1.5 flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium text-gray-500 transition-opacity ltr:right-1.5 rtl:left-1.5 contrast-more:text-current"
          >
            <svg
              className="size-4 text-gray-800 dark:text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
              <rect width="256" height="256" fill="none" />
              <line
                x1="200"
                y1="56"
                x2="56"
                y2="200"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
              <line
                x1="200"
                y1="200"
                x2="56"
                y2="56"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-0 top-0 my-1.5 flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 transition-opacity ltr:right-1.5 rtl:left-1.5 contrast-more:border-current contrast-more:text-current dark:border-gray-100/20 dark:bg-black/50 contrast-more:dark:border-current max-sm:hidden">
            CTRL K
          </kbd>
        )}
      </div>
      <span hidden={!isSearchStalled}>Searching…</span>
    </form>
  )
}
