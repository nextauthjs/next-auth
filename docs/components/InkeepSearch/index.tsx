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
        className="flex items-center gap-2 rounded-lg bg-black/[.05] px-3 py-1.5 text-base leading-tight text-gray-800 transition-colors md:text-sm dark:bg-gray-50/10 dark:text-gray-200"
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
