import { useEffect } from "react"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, Hits, useInstantSearch } from "react-instantsearch"
//import { InstantSearchNext } from "react-instantsearch-nextjs"
import { CustomSearchBox } from "./searchInput"
import Hit from "./hit"

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_KEY!
)

const searchClient = {
  ...algoliaClient,
  search(requests: any) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: "",
          params: "",
        })),
      })
    }
    return algoliaClient.search(requests)
  },
}

export default function () {
  const ctrlKHandler = (e: KeyboardEvent) => {
    if (e.repeat || e.target instanceof HTMLInputElement) return
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault()
      document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", ctrlKHandler)

    return window.addEventListener("keydown", ctrlKHandler)
  }, [])

  return (
    <div className="relative">
      <InstantSearch
        indexName="next-auth"
        // @ts-expect-error
        searchClient={searchClient}
      >
        <CustomSearchBox />
        <NoResultsBoundary>
          <Hits
            hitComponent={Hit}
            className="fixed top-28 left-2 md:left-auto md:absolute md:right-0 w-[calc(100vw_-_16px)] md:top-12 p-2 md:w-96 rounded-md shadow-lg bg-neutral-100 dark:bg-neutral-800 [&>ol]:flex [&>ol]:flex-col max-h-[calc(100dvh_-_120px)] overflow-y-auto [&>ol]:divide-y [&>ol]:divide-neutral-400/30 [&>ol]:dark:divide-neutral-900/50"
          />
        </NoResultsBoundary>
      </InstantSearch>
    </div>
  )
}

function NoResultsBoundary({ children }) {
  const { indexUiState, results } = useInstantSearch()

  if (
    indexUiState.query !== undefined &&
    !results.__isArtificial &&
    results.nbHits === 0
  ) {
    return (
      <div className="fixed text-center top-28 left-2 md:left-auto md:absolute md:right-0 w-[calc(100vw_-_16px)] md:top-12 p-2 md:w-96 rounded-md shadow-md bg-neutral-100 dark:bg-neutral-800 [&>ol]:flex [&>ol]:flex-col max-h-[calc(100dvh_-_120px)] overflow-y-auto [&>ol]:divide-y [&>ol]:divide-neutral-400/30 [&>ol]:dark:divide-neutral-900/50">
        No Results
      </div>
    )
  }

  if (indexUiState.query === undefined) {
    return null
  }

  return children
}
