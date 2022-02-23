import Markdown from "markdown-it";

const mkit = new Markdown({ html: true });
export function handleMarkdown(str) {
  return mkit.render(str);
}
