import { codeToHtml } from "shiki/index.mjs"

export function highlight (command: string, theme: "light" | "dark" = "dark"): string {
  codeToHtml(command, {
    lang: 'javascript',
    theme: `github-${theme}`
  }).then((html) => {
    return html
  })
  
  return ""
}