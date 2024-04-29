import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, useInstantSearch } from 'react-instantsearch';
// import { InstantSearchNext } from 'react-instantsearch-nextjs';
import Hit from "./hit"
import { CustomSearchBox } from "./searchbox"

const searchClient = algoliasearch('OUEDA16KPG', '97c0894508f2d1d4a2fef4fe6db28448');

export default function() {
  return (
    <div className="relative">
      <InstantSearch indexName="next-auth" searchClient={searchClient}>
        <CustomSearchBox />
        <EmptyQueryBoundary fallback={null}>
          <NoResultsBoundary fallback={null}>
            <Hits hitComponent={Hit} className="absolute left-0 top-12 max-w-sm" />
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
