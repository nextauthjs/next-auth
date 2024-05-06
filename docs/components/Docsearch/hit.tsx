import { Highlight, useInstantSearch } from "react-instantsearch"
import Link from "next/link"

export default function Hit({ hit }) {
  const { setIndexUiState } = useInstantSearch()
  const hierarchy = Object.values(hit.hierarchy)?.filter(Boolean)
  const path = new URL(hit.url_without_anchor).pathname

  const onClick = () => {
    setIndexUiState((prevIndexUiState) => ({
      ...prevIndexUiState,
      query: "",
    }))
  }

  return (
    <Link
      key={hit.objectID}
      href={hit.url}
      onClick={onClick}
      className="flex flex-col gap-2 p-4 px-2 rounded-md text-neutral-800 group dark:text-neutral-100 hover:dark:bg-neutral-900 hover:bg-neutral-200"
    >
      <h3 className="flex items-center text-sm font-semibold after:content-[''] whitespace-nowrap after:absolute after:bg-gradient-to-r after:h-6 after:right-0 after:w-12 after:from-transparent after:to-neutral-100 after:dark:to-neutral-800 relative overflow-hidden group-hover:dark:after:to-neutral-900 group-hover:after:to-neutral-200">
        {hierarchy.map((label: string, idx: number) => (
          <>
            <span className="">{label}</span>
            {idx < hierarchy.length - 1 ? <CaretRight /> : null}
          </>
        ))}
      </h3>
      <Highlight
        classNames={{
          highlighted: "dark:text-white dark:bg-violet-800 bg-violet-300",
        }}
        attribute="content"
        className="text-sm line-clamp-4"
        hit={hit}
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-600">{path}</p>
    </Link>
  )
}

function CaretRight() {
  return (
    <svg
      className="size-3 min-w-3"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="96 48 176 128 96 208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}
