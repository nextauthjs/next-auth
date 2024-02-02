import {
  BundledLanguage,
  BundledTheme,
  HighlighterGeneric,
  getHighlighter,
} from "shikiji";

export type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

let hl: Highlighter | null = null;

async function init() {
  if (hl) return;

  hl = await getHighlighter({
    themes: ["nord", "min-light"],
    langs: ["ts", "tsx", "bash"],
  });
}

function highlight(code: string) {
  return hl
    ? hl.codeToHtml(code, {
        lang: "tsx",
        themes: {
          light: "min-light",
          dark: "nord",
        },
      })
    : null;
}

export default {
  init,
  highlight,
};
