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
        <span className="text-[0.65rem] font-normal text-neutral-400">
          Sponsored
        </span>
        <a href="https://go.clerk.com/DefS1u4" target="_blank">
          <div className="mt-2 space-y-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 font-medium leading-snug text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
            Looking for a<br />
            hosted alternative?
            <div className="font-semibold text-violet-600 dark:text-violet-400">
              Use Clerk &#8594;
            </div>
          </div>
        </a>
      </>
    ),
    type: "separator",
  },
}
