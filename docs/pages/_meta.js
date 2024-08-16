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
          <div className="space-y-1 py-2 px-3 mt-2 leading-snug rounded-md border bg-neutral-100 text-neutral-500 font-medium border-neutral-300 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700">
            Looking for a<br />
            hosted alternative?
            <div className="text-violet-600 font-semibold dark:text-violet-400">
              Use Clerk &#8594;
            </div>
          </div>
        </a>
      </>
    ),
    type: "separator",
  },
}
