import { useState, useCallback } from "react"
import { InkeepCustomTrigger, InkeepCustomTriggerProps } from "@inkeep/widgets"
import useInkeepSettings from "@/utils/useInkeepSettings"
import { Sparkle } from "@phosphor-icons/react/Sparkle"

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
        <Sparkle size={18} />
        Ask AI
      </button>
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </div>
  )
}
