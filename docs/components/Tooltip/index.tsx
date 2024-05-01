import React, { useRef } from "react"
import polyfill from "@oddbird/css-anchor-positioning/fn"

interface Props {
  label: string
  framework: string
  children: React.ReactNode
}

export function Tooltip({ label, framework, children }: Props) {
  // CSS Anchor Positioning Polyfill
  // https://github.com/oddbird/css-anchor-positioning
  polyfill()

  const popoverTargetRef = useRef()
  const slug = label.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

  return (
    <div className="relative w-full">
      <button
        id={`anchor-${framework}-${slug}`}
        // @ts-expect-error
        popovertarget={`popover-${framework}-${slug}`}
        className="w-full tooltip-anchor"
        // @ts-expect-error
        onMouseEnter={() => popoverTargetRef.current?.showPopover?.()}
        // @ts-expect-error
        onMouseLeave={() => popoverTargetRef.current?.hidePopover?.()}
      >
        {children}
      </button>
      <div
        popover="auto"
        // @ts-expect-error
        ref={popoverTargetRef}
        className="py-2 px-4 max-w-xs text-sm text-center text-fuchsia-900 bg-purple-100 rounded-lg border shadow-md"
        anchor={`anchor-${framework}-${slug}`}
        id={`popover-${framework}-${slug}`}
      >
        {label}
      </div>
    </div>
  )
}
