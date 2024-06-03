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
    <div>
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
        className="relative max-md:ml-6"
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
          className="max-w-48 w-full appearance-none rounded-lg px-3 py-1.5 transition-colors text-base leading-tight md:text-sm bg-black/[.05] dark:bg-gray-50/10 focus:!bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-2"
        />
        {inputValue.length ? (
          <button
            type="reset"
            hidden={inputValue.length === 0 || isSearchStalled}
            className="flex absolute top-0 right-2 gap-1 items-center px-1.5 my-1.5 h-5 font-mono font-medium text-gray-500 rounded transition-opacity select-none ltr:right-1.5 rtl:left-1.5 text-[10px] contrast-more:text-current"
          >
            <svg
              className="text-gray-800 dark:text-gray-200 size-4"
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
          <kbd className="flex absolute top-0 right-0 gap-1 items-center px-1.5 my-1.5 h-5 font-mono font-medium text-gray-500 bg-white rounded border transition-opacity pointer-events-none select-none ltr:right-1.5 rtl:left-1.5 text-[10px] contrast-more:border-current contrast-more:text-current contrast-more:dark:border-current max-sm:hidden dark:border-gray-100/20 dark:bg-black/50">
            CTRL K
          </kbd>
        )}
        <span hidden={!isSearchStalled}>Searching…</span>
      </form>
    </div>
  )
}
