import React from 'react'

export { Page }

function Page({ is404 }: { is404: boolean }) {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </>
    )
  } else {
    return (
      <>
        <h1>500 Internal Server Error</h1>
        <p>Something went wrong.</p>
      </>
    )
  }
}
