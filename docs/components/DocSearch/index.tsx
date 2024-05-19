import dynamic from "next/dynamic"

const DocSearch = dynamic(
  () => import("./wrapper").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="relative max-md:ml-6 h-8 appearance-none rounded-lg px-3 py-1.5 transition-colors text-base leading-tight md:text-sm bg-black/[.05] dark:bg-gray-50/10 focus:!bg-transparent pr-2 w-48 text-gray-500 dark:text-gray-400">
        Search...
        <kbd className="flex absolute top-0 right-0 gap-1 items-center px-1.5 my-1.5 h-5 font-mono font-medium text-gray-500 bg-white rounded border transition-opacity pointer-events-none select-none ltr:right-1.5 rtl:left-1.5 text-[10px] contrast-more:border-current contrast-more:text-current contrast-more:dark:border-current max-sm:hidden dark:border-gray-100/20 dark:bg-black/50">
          CTRL K
        </kbd>
      </div>
    ),
  }
)

export default DocSearch
