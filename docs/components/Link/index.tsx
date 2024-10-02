import { ChildrenProps } from "../../utils/types"

export function Link({
  children,
  ...rest
}: ChildrenProps & { href: string; className?: string; target?: string }) {
  return (
    <a
      className="font-medium text-sky-600 no-underline dark:text-sky-500"
      {...rest}
    >
      {children}
    </a>
  )
}
