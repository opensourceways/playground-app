import Markdown from "markdown-it";

const mkit = new Markdown({ html: true });
export function handleMarkdown(str) {
  // 支持可执行命令
  const rlt = str
    // 不换行代码块
    .replace(/`{3}(.+?)`{3}{{([^}}]+?)}}/g, '<code exec="$2">$1</code>')
    // 行内代码
    .replace(/`([^`]+?)`{{([^}}]+?)}}/g, '<code exec="$2">$1</code>')
    // 换行代码块
    .replace(/`{3}(.*)([^`{3}]+?)`{3}{{(.+?)}}/g, (_, $1, $2, $3) => {
      const classname = $1 ? `class="language-${$1}"` : "";
      const exec = $3 ? `exec="${$3}"` : "";
      const content = $2.replace(/^\n/g, "");

      return `<pre><code ${classname} ${exec}>${content}</code></pre>`;
    });

  return mkit.render(rlt);
}
