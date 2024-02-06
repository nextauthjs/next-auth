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
    themes: ["github-light", "github-dark"],
    langs: ["ts", "tsx", "bash"],
  })
}

function highlight(code: string) {
  return hl
    ? hl.codeToHtml(code, {
        lang: "tsx",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      })
    : null
}

export default {
  init,
  highlight,
}
