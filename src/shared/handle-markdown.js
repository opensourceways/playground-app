import Markdown from "markdown-it";

const mkit = new Markdown({ html: true });
export function handleMarkdown(str) {
  // return mkit.render(str);
  str = `
1. \`git clone\`

使用<code exec="git clone">git clone</code>将我们的示例目录进行克隆：

\`\`\`
git clone xxx
\`\`\`

可执行的代码

<pre><code exec="git clone xxx">git clone xxx</code></pre>
`;

  const rlt = mkit.render(str);
  console.log(str);
  return rlt;
}
