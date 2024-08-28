import { useListDisclosure } from "./useListDisclosure"
import cx from "classnames"

interface Props {
  children: React.ReactElement[]
  limit: number
  className?: string
}

export function ListDisclosure({ children, limit, className = "" }: Props) {
  const { displayLimit, handleCollapseAll, handleDisplayMore } =
    useListDisclosure(limit)

  const rendered = children.slice(0, displayLimit)
  const isAllDisplayed = displayLimit >= children.length

  return (
    <>
      <div
        className={cx(
          "my-4 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
          className
        )}
      >
        {rendered}
      </div>
      <button
        className="rounded-full bg-neutral-400 p-2 px-4 text-sm font-semibold text-white dark:bg-neutral-950"
        onClick={isAllDisplayed ? handleCollapseAll : handleDisplayMore}
      >
        {isAllDisplayed ? "Collapse all" : "Show more"}
      </button>
    </>
  )
}
