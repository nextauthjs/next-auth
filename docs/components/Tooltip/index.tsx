import React from "react"
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip"

interface Props {
  label: string
  children: React.ReactNode
}

export function Tooltip({ label, children }: Props) {
  return (
    <ArkTooltip.Root
      positioning={{ placement: "bottom" }}
      openDelay={0}
      lazyMount
      unmountOnExit
    >
      <ArkTooltip.Trigger asChild={true}>{children}</ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className="py-2 px-4 max-w-xs text-sm text-center text-fuchsia-900 bg-purple-100 rounded-lg border shadow-md"
          style={{ animation: "	animation: fadeIn .2s linear" }}
        >
          {label}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  )
}
