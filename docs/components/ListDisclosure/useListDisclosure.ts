import { useState } from "react"

export function useListDisclosure(initialLimit: number) {
  const [displayLimit, setDisplayed] = useState<number>(initialLimit)

  function handleDisplayMore() {
    setDisplayed((s: number) => Number(s) + Number(initialLimit))
  }

  function handleCollapseAll() {
    setDisplayed(initialLimit)
  }

  return {
    handleDisplayMore,
    handleCollapseAll,
    displayLimit,
  }
}
