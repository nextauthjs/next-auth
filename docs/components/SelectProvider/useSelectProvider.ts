import manifest from "@/data/manifest.json"
import { useQueryState } from "nuqs"
import { useEffect, useState } from "react"

const providerList = Object.entries(manifest.providersOAuth).map(
  ([id, name]) => {
    return { id, name }
  }
)

export function useSelectProvider() {
  const [term, setTerm] = useState("")
  const [selected, setSelected] = useQueryState("provider")

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
