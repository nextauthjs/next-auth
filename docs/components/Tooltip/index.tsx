"use client"

import React, { useRef } from "react"
import polyfill from "@oddbird/css-anchor-positioning/fn"
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip"

interface Props {
  label: string
  framework: string
  children: React.ReactNode
}

export function Tooltip({ label, framework, children }: Props) {
  if (typeof window === "undefined") return null

  const supportsPopover =
    HTMLElement?.prototype.hasOwnProperty("popover") ?? false

  if (supportsPopover) {
    // Web Native Popover
    const popoverTargetRef = useRef()
    const slug = label.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

    // Enable CSS Anchor Positioning Polyfill
    // https://github.com/oddbird/css-anchor-positioning
    polyfill()

    return (
      <div className="relative w-full">
        <button
          id={`anchor-${framework}-${slug}`}
          popovertarget={`popover-${framework}-${slug}`}
          className="w-full tooltip-anchor"
          onMouseEnter={() => popoverTargetRef.current?.showPopover()}
          onMouseLeave={() => popoverTargetRef.current?.hidePopover()}
        >
          {children}
        </button>
        <div
          popover="auto"
          ref={popoverTargetRef}
          className="py-2 px-4 max-w-xs text-sm text-center text-fuchsia-900 bg-purple-100 rounded-lg border shadow-md"
          anchor={`anchor-${framework}-${slug}`}
          id={`popover-${framework}-${slug}`}
        >
          {label}
        </div>
      </div>
    )
  } else {
    // Ark Tooltip
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
}
