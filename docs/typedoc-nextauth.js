// @ts-check

import { MarkdownPageEvent } from "typedoc-plugin-markdown"
import path from "path"
import fs from "fs"

/**
 * Local plugin to tweak TypeDoc output for nextra docs
 *
 *  @param {import("typedoc-plugin-markdown").MarkdownApplication} app
 */
export function load(app) {
  injectNextraCalloutImport(app)
  parseOutput(app)
  writeMetaJsFiles(app)
}

/**
 * Add nextra Callout component import to the top of each page
 *
 *  @param {import("typedoc-plugin-markdown").MarkdownApplication} app
 */
function injectNextraCalloutImport(app) {
  const nextraCalloutImport = `import { Callout } from 'nextra/components';`
  app.renderer.markdownHooks.on("page.begin", () => nextraCalloutImport)
  app.renderer.markdownHooks.on("index.page.begin", () => nextraCalloutImport)
}

/**
 * - Parse Docusaurus style admonitions to Callout elements
 * - Parse Docusaurus style code block titles to MDX compatible code block titles
 *  @param {import("typedoc-plugin-markdown").MarkdownApplication} app
 */
function parseOutput(app) {
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    const calloutRegex = /:::([^\n\s]*)([^\n]*)([\s\S]*?):::/g
    const codeBlockRegex = /(```(ts|js|sh|json)\s)title="([^"]*)"/g

    // map existing alert types to nextra
    const calloutTypeMap = {
      note: "info",
      caution: "warning",
      danger: "error",
      tip: "default",
    }

    const replaceCallout = (match, p1, p2, p3) => {
      const calloutType = calloutTypeMap[p1.trim()] || p1.trim()
      const title = p2 ? `**${p2.trim()}** ` : ""
      return `
<Callout type="${calloutType}">
  ${title}${p3.trim()}
</Callout>`
    }

    // replace ```ts title="xx" with ```ts filename="xx"
    const replaceCodeBlockTitle = (match, p1, p2, p3) => `${p1}filename="${p3}"`

    page.contents = page.contents
      ?.replace(calloutRegex, replaceCallout)
      .replace(codeBlockRegex, replaceCodeBlockTitle)
  })
}

/**
 * Writes Nextra _meta.js files to fix-up navigation labels.
 *
 *  @param {import("typedoc-plugin-markdown").MarkdownApplication} app
 */
function writeMetaJsFiles(app) {
  app.renderer.postRenderAsyncJobs.push(async (output) => {
    /**
     *
     * @param {import("typedoc-plugin-markdown").NavigationItem[]} navigationItems
     * @param {string} outputDirectory
     * @param {Record<string,string>} defaultValue
     */
    const writeMetaJs = (
      navigationItems,
      outputDirectory,
      defaultValue = {}
    ) => {
      const pages = defaultValue
      navigationItems.forEach((item) => {
        const pageKey = item.path ? path.parse(item.path).name : null
        if (pageKey) {
          pages[pageKey] = item.title
          if (item?.children && item?.children?.length > 0) {
            writeMetaJs(item.children, path.join(outputDirectory, pageKey), {})
          }
        }
      })

      // Rename generated 'next-auth' dir to 'nextjs'
      if (new RegExp(".*docs/pages/reference/nextjs$").test(outputDirectory)) {
        if (fs.existsSync("./pages/reference/nextjs")) {
          fs.rmdirSync("./pages/reference/nextjs", { recursive: true })
        }
        fs.renameSync("./pages/reference/next-auth", "./pages/reference/nextjs")
      }

      const metaJString = `
export default ${JSON.stringify(pages, null, 2)}`

      if (new RegExp(".*docs/pages/reference$").test(outputDirectory)) return

      fs.writeFileSync(path.join(outputDirectory, "_meta.js"), metaJString)
    }

    /**
     * Recursively write _meta.js files for each page based on output.navigation
     */
    if (output.navigation) {
      writeMetaJs(output.navigation, output.outputDirectory, {
        overview: "Overview",
      })
    }
  })
}
