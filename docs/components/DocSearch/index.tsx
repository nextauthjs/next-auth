import dynamic from "next/dynamic"

const DocSearch = dynamic(
  () => import("./wrapper").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-8 w-48 appearance-none rounded-lg bg-black/[.05] px-3 py-1.5 pr-2 text-base leading-tight text-gray-500 transition-colors focus:!bg-transparent max-md:ml-6 md:text-sm dark:bg-gray-50/10 dark:text-gray-400">
        Search...
        <kbd className="pointer-events-none absolute right-0 top-0 my-1.5 flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 transition-opacity contrast-more:border-current contrast-more:text-current max-sm:hidden ltr:right-1.5 rtl:left-1.5 dark:border-gray-100/20 dark:bg-black/50 contrast-more:dark:border-current">
          CTRL K
        </kbd>
      </div>
    ),
  }
)

export default DocSearch
