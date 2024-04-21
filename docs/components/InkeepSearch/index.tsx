import { useState, useCallback } from "react"
import { InkeepCustomTrigger, InkeepCustomTriggerProps } from "@inkeep/widgets"
import useInkeepSettings from "@/utils/useInkeepSettings"
import { Sparkle } from "@/icons"

export function InkeepTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const { baseSettings, aiChatSettings, modalSettings } = useInkeepSettings()

  const inkeepCustomTriggerProps: InkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    baseSettings,
    aiChatSettings,
    modalSettings,
  }

  return (
    <div>
      <button
        className="flex gap-2 items-center py-1.5 px-3 text-base leading-tight text-gray-800 rounded-lg transition-colors md:text-sm dark:text-gray-200 bg-black/[.05] dark:bg-gray-50/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sparkle className="size-4" />
        <span className="hidden md:inline xl:hidden">AI</span>
        <span className="hidden xl:inline">Ask AI</span>
      </button>
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </div>
  )
}
