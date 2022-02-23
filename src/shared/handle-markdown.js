import Markdown from "markdown-it";

const mkit = new Markdown({ html: true });
export function handleMarkdown(str) {
  // 支持可执行命令
  const rlt = str
    .replace(/```(.+?)```{{([^}}]+?)}}/g, '<code exec="$2">$1</code>')
    .replace(/`([^`]+?)`{{([^}}]+?)}}/g, '<code exec="$2">$1</code>')
    .replace(/```(.*)([\s\S]+?)```{{(.+?)}}/g, (_, $1, $2, $3) => {
      let classname = $1 ? `class="language-${$1}"` : "";
      let exec = $3 ? `exec="${$3}"` : "";

      return `<pre><code ${classname} ${exec}>${$2}</code></pre>`;
    });

  return mkit.render(rlt);
}
