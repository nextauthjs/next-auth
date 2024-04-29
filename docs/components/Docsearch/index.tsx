import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, useInstantSearch } from 'react-instantsearch';
// import { InstantSearchNext } from 'react-instantsearch-nextjs';
import Hit from "./hit"
import { CustomSearchBox } from "./searchbox"

const algoliaClient = algoliasearch('OUEDA16KPG', '97c0894508f2d1d4a2fef4fe6db28448');

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
          query: '',
          params: '',
        })),
      });
    }
    return algoliaClient.search(requests);
  },
};

export default function() {
  return (
    <div className="relative">
      <InstantSearch
        indexName="next-auth"
        // @ts-expect-error 
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <CustomSearchBox />
        <EmptyQueryBoundary fallback={null}>
          <NoResultsBoundary fallback={null}>
            <Hits hitComponent={Hit} className="absolute right-0 top-12 p-2 w-96 rounded-md bg-neutral-200 dark:bg-neutral-800 [&>ol]:flex [&>ol]:flex-col max-h-[calc(100dvh_-_120px)] overflow-y-auto [&>ol]:divide-y [&>ol]:divide-neutral-400/30 [&>ol]:dark:divide-neutral-900/50" />
          </NoResultsBoundary>
        </EmptyQueryBoundary>
      </InstantSearch>
    </div>
  )
}

function NoResultsBoundary({ children, fallback }) {
  const { results } = useInstantSearch();

  if (!results.__isArtificial && results.nbHits === 0) {
    return fallback;
  }

  return children;
}

function EmptyQueryBoundary({ children, fallback }) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}
