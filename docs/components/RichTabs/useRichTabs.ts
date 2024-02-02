import { useQueryState } from "nuqs"
import { useEffect } from "react"

interface Args {
  onTabChange: ((value: string) => void) | undefined
  defaultValue: string
}

export function useRichTabs({ onTabChange, defaultValue }: Args) {
  const [tabValue, setTabValue] = useQueryState("tab")

  useEffect(() => {
    if (!tabValue && defaultValue) {
      setTabValue(defaultValue)
    }
  }, [tabValue])

  function handleValueChanged(value: string) {
    setTabValue(value)
    if (onTabChange) {
      onTabChange(value)
    }
  }

  return {
    tabValue,
    handleValueChanged,
  }
}
