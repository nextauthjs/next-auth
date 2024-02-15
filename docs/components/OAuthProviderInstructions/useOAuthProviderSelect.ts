import { useEffect, useState } from "react"
import { useQueryState, parseAsString } from "nuqs"
import manifest from "@/data/manifest.json"

const providerList = Object.entries(manifest.providersOAuth).map(
  ([id, name]) => {
    return { id, name }
  }
)

export function useOAuthProviderSelect() {
  const [term, setTerm] = useState("")
  const [selected, setSelected] = useQueryState(
    "provider",
    parseAsString.withDefault("")
  )

  useEffect(() => {
    // if landing to the page with a provider pre-selected
    if (!term && selected) {
      setTerm(manifest.providersOAuth[selected])
    }
  }, [selected])

  function handleSearchItem(term: string) {
    setTerm(term)
  }

  function handleSelectOption(item: { id: string; name: string }) {
    setTerm(item.name)
    setSelected(item.id)
  }

  return {
    items: providerList.filter((item) =>
      item.name.toLowerCase().includes(term?.toLowerCase())
    ),
    term,
    selected,
    handleSearchItem,
    handleSelectOption,
  }
}
