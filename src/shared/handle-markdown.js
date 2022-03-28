import Markdown from "markdown-it";

const CODE_TYPES = {
  PRINT: "print",
  PRINT_WITH_CMD: "print-width-cmd",
  RUN: "run",
  RUN_WITH_CMD: "run-with-cmd",
};

const getCodeType = (str) => {
  if (/^PRINT/.test(str)) {
    return /^PRINT$/.test(str) ? CODE_TYPES.PRINT : CODE_TYPES.PRINT_WITH_CMD;
  } else if (/^RUN/.test(str)) {
    return /^RUN\|/.test(str)
      ? CODE_TYPES.RUN_WITH_CMD
      : /^RUN$/.test(str)
      ? CODE_TYPES.RUN
      : CODE_TYPES.PRINT_WITH_CMD;
  }
  return CODE_TYPES.PRINT_WITH_CMD;
};

const getCmdStr = (cmd) => {
  let cmdStr = "";
  if (cmd) {
    cmdStr = `exec="${cmd}" `;
  }
  return cmdStr;
};

const getCode = (cmd) => {
  let result = {};
  switch (getCodeType(cmd)) {
    case CODE_TYPES.PRINT:
      result.type = "print";
      result.cmd = null;
      break;
    case CODE_TYPES.PRINT_WITH_CMD:
      result.type = "print";
      result.cmd = cmd.replace(/^PRINT\|/, "");
      break;
    case CODE_TYPES.RUN:
      result.type = "run";
      result.cmd = null;
      break;
    case CODE_TYPES.RUN_WITH_CMD:
      result.type = "run";
      result.cmd = cmd.replace(/^RUN\|/, "");
      break;
    default:
      result.type = "print";
      result.cmd = null;
  }

  return result;
};

const mkit = new Markdown({ html: true });
export function handleMarkdown(str, parseFn) {
  // 支持可执行命令
  let rlt = str
    // 不换行代码块
    // .replace(/`{3}(.+?)`{3}{{([^}}]+?)}}/g, '<code exec="$2">$1</code>')
    .replace(/`{3}(.+?)`{3}{{([^}}]+?)}}/g, (_, $1, $2) => {
      const code = getCode($2);
      return `<code ${getCmdStr(code.cmd)}type="${code.type}">${$1}</code>`;
    })
    // 行内代码
    // .replace(/`([^`]+?)`{{([^}}]+?)}}/g, '<code exec="$2">$1</code>')
    .replace(/`([^`]+?)`{{([^}}]+?)}}/g, (_, $1, $2) => {
      const code = getCode($2);
      return `<code ${getCmdStr(code.cmd)}type="${code.type}">${$1}</code>`;
    })
    // 换行代码块
    .replace(/`{3}(.*)([^`{3}]+?)`{3}{{(.+?)}}/g, (_, $1, $2, $3) => {
      console.log($1);
      const classname = $1 ? `class="language-${$1}"` : "";

      const code = getCode($3);
      const cmdStr = `${getCmdStr(code.cmd)} `;
      const typeStr = `type="${code.type}" `;

      const content = $2.replace(/^\n/g, "");
      return `<pre><code ${cmdStr}${typeStr}${classname}>${content}</code></pre>`;
    });

  if (parseFn) {
    rlt = parseFn(rlt);
  }
  // const test = mkit.render(rlt);
  // console.log(test);
  return mkit.render(rlt);
}
