import { Highlight, Snippet } from 'react-instantsearch';

export default function Hit({ hit }) {
  console.log("HIT", hit)
  return (
    <article>
      <h1>
        <Highlight attribute="name" hit={hit} />
      </h1>
      <p className="text-gray-200 dark:text-gray-800">{hit.content}</p>
      <Snippet hit={hit} attribute="description" />
    </article>
  );
}
