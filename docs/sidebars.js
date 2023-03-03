// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  gettingStartedSidebar: [
    {
      type: "autogenerated",
      dirName: "getting-started",
    },
  ],
  guidesSidebar: [
    {
      type: "autogenerated",
      dirName: "guides",
    },
  ],
  referenceSidebar: [
    {
      type: "category",
      label: "@auth/core",
      link: { type: "doc", id: "reference/core/index" },
      items: [{ type: "autogenerated", dirName: "reference/core" }],
    },
    {
      type: "category",
      label: "@auth/sveltekit",
      link: { type: "doc", id: "reference/sveltekit/index" },
      items: [{ type: "autogenerated", dirName: "reference/sveltekit" }],
    },
    {
      type: "category",
      label: "@auth/solid-start",
      link: { type: "doc", id: "reference/solidstart/index" },
      items: [{ type: "autogenerated", dirName: "reference/04-solidstart" }],
    },
    {
      type: "category",
      label: "@auth/nextjs",
      link: { type: "doc", id: "reference/nextjs/index" },
      items: [
        "reference/nextjs/client",
        {
          type: "link",
          label: "NextAuth.js (next-auth)",
          href: "https://next-auth.js.org",
        },
      ],
    },
    {
      type: "category",
      label: "Database Adapters",
      link: { type: "doc", id: "reference/adapters/overview" },
      items: [
        { type: "doc", id: "reference/adapter/firebase/index" },
        { type: "doc", id: "reference/adapter/dgraph/index" },
        { type: "autogenerated", dirName: "reference/06-adapters" },
      ],
    },
    "reference/utilities/client",
    "reference/warnings",
  ],
  conceptsSidebar: [
    {
      type: "autogenerated",
      dirName: "concepts",
    },
  ],
}
