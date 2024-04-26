import React from "react"
import { ChildrenProps } from "../../utils/types"

export function Link({
  children,
  ...rest
}: ChildrenProps & { href: string; className?: string; target?: string }) {
  return (
    <a
      className="no-underline text-sky-600 font-medium dark:text-sky-500"
      {...rest}
    >
      {children}
    </a>
  )
}
