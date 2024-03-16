// @ts-check

const {
  MarkdownTheme,
  MarkdownThemeRenderContext,
} = require("typedoc-plugin-markdown")
const { Reflection } = require("typedoc")
const path = require("path")

/**
 * Local plugin to tweak TypeDoc output for nextra docs
 *
 *  @param {import("typedoc-plugin-markdown").MarkdownApplication} app
 */
module.exports.load = (app) => {
  /**
   *
   * Define a custom theme so we amend the urls of the output.
   */
  app.renderer.defineTheme("nextauth", NextAuthDocsTheme)

  app.renderer.markdownHooks.on(
    "page.begin",
    () => `import { Callout } from 'nextra/components';`
  )
}

/**
 *
 */
class NextAuthDocsTheme extends MarkdownTheme {
  /** @param {import("typedoc-plugin-markdown").MarkdownPageEvent<Reflection>} page */
  getRenderContext(page) {
    return new ThemeRenderContext(this, page, this.application.options)
  }

  /** @param {import("typedoc").ProjectReflection} project */
  getUrls(project) {
    const entryFileName = this.application.options.getValue("entryFileName")
    /**
     * Move the url of the entry page up a leve.
     */
    const replaceExt = (filePath) => {
      const ext = ".mdx"
      let parsedPath = path.parse(filePath)
      parsedPath.ext = ext
      parsedPath.base = `${parsedPath.name}${ext}`
      return path.format(parsedPath)
    }
    return super.getUrls(project).map((urlMapping) => {
      const url =
        urlMapping.url === entryFileName
          ? replaceExt(`../${urlMapping.url}`)
          : replaceExt(`${urlMapping.url}`)
      return {
        ...urlMapping,
        url,
      }
    })
  }
}

class ThemeRenderContext extends MarkdownThemeRenderContext {
  helpers = {
    ...this.helpers,
    /**
     * Parse docusauruas style adomination to a Callout element
     * @param {string} comments
     */
    parseComments: (comments) => {
      const calloutRegex = /:::([^\n\s]*)([^\n]*)([\s\S]*?):::/g
      const codeBlockRegex = /(```(ts|js)\s)title="([^"]*)"/g

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
      const replaceCodeBlockTitle = (match, p1, p2, p3) =>
        `${p1}filename="${p3}"`

      return comments
        .replace(calloutRegex, replaceCallout)
        .replace(codeBlockRegex, replaceCodeBlockTitle)
    },
    /**
     * Fix the urls to the entry page.
     * @param {string} url
     */
    parseUrl: (url) => {
      if (url.startsWith("/reference/core/core.md")) {
        url = url.replace("/core.md", "")
      }
      if (url.includes("/@auth")) {
        url = url.replace("/@auth", "")
      }
      return url
    },
  }
}
