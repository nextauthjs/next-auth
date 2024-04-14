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
      <div className="-mt-6">
        <span className="text-[0.65rem] text-slate-400">Sponsored</span>
        <div className="flex flex-col gap-1 ml-[1px] p-2 text-xs rounded-md bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 ring-1 ring-slate-300 dark:ring-gray-700">
          Looking for a hosted alternative?
          <a
            href="https://clerk.com?utm_source=sponsorship&utm_medium=website&utm_campaign=authjs&utm_content=nav"
            target="_blank"
            className="text-sky-600 dark:text-sky-500"
          >
            Use Clerk ›
          </a>
        </div>
      </div>
    ),
    type: "separator",
  },
}
