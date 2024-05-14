export default {
  index: {
    title: "Homepage",
    type: "page",
    display: "hidden",
    theme: {
      breadcrumb: false,
      sidebar: false,
      footer: false,
      layout: "raw",
    },
  },
  "getting-started": {
    title: "Getting Started",
    type: "page",
  },
  guides: {
    title: "Guides",
    type: "page",
  },
  reference: {
    title: "API reference",
    type: "page",
  },
  concepts: {
    title: "Concepts",
    type: "page",
  },
  security: {
    title: "Security",
    type: "page",
  },
  contributors: {
    title: "Contributors",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
    },
  },
  sponsors: {
    title: "Sponsors",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
    },
  },
  404: {
    title: "404",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
    },
  },
  "-- Sponsor": {
    title: (
      <>
        <span className="font-normal text-[0.65rem] text-neutral-400">
          Sponsored
        </span>
        <a href="https://go.clerk.com/DefS1u4" target="_blank">
          <div className="flex flex-col gap-1 p-2 mt-2 text-xs font-normal rounded-md border ml-[1px] bg-neutral-100 text-neutral-500 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700">
            Looking for a hosted alternative?
            <span className="text-sky-600 dark:text-sky-500">Use Clerk ›</span>
          </div>
        </a>
      </>
    ),
    type: "separator",
  },
}
