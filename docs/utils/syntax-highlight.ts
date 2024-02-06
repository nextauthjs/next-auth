import {
  BundledLanguage,
  BundledTheme,
  HighlighterGeneric,
  getHighlighter,
} from "shikiji"

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

let hl: Highlighter | null = null

async function init() {
  if (hl) return

  hl = await getHighlighter({
    themes: ["github-dark-dimmed", "github-dark"],
    langs: ["ts", "tsx", "bash"],
  })
}

function highlight(code: string) {
  return hl
    ? hl.codeToHtml(code, {
        lang: "tsx",
        themes: {
          light: "github-dark",
          dark: "github-dark",
        },
      })
    : null
}

export default {
  init,
  highlight,
}
