import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface Args {
  onTabChange: ((value: string) => void) | undefined
  defaultValue: string
  value: string
  persist?: boolean
  tabKey?: string
  setValue?: any
}

export function useRichTabs({
  onTabChange,
  tabKey = "tab",
  persist = true,
  value,
  setValue,
}: Args) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsTab = searchParams?.get(tabKey)

  // Handle searchParams
  if (searchParamsTab && value !== searchParamsTab) {
    router.push(pathname!)
    setValue((prevVal: string) => {
      if (prevVal !== searchParamsTab) {
        return searchParamsTab
      }
    })
    persist && window.localStorage.setItem(`authjs.${tabKey}`, value)
  }

  // TODO: Handle localStorage saved value
  // if (!searchParamsTab && typeof window !== "undefined") {
  //   const storedTab = window.localStorage.getItem(`authjs.${tabKey}`)
  //   if (storedTab && storedTab !== value) {
  //     setValue(storedTab)
  //   }
  // }
  //
  function handleValueChanged(value: string) {
    setValue(value)
    persist && window.localStorage.setItem(`authjs.${tabKey}`, value)
    onTabChange && onTabChange(value)
  }

  return {
    handleValueChanged,
  }
}
