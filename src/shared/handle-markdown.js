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

/**
 *
 * @param {String} str
 * 1-1: ```git clone```
 * 1-2: ```[[git clone]]{{RUN}}```
 *
 * 2-1: ```
 *      git clone
 *      ```
 * 2-2: ```
 *      [[git clone]]{{RUN}}
 *      ```
 * 2-3: ```shell
 *      [[git clone]]{{RUN}}
 *      ```
 *
 * 3-1: `git clone`
 * 3-2: `[[git clone]]{{RUN}}`
 *
 * @param {Function} parseFn
 * @returns
 */
export function handleMarkdown(str, parseFn) {
  // 支持可执行命令
  let rlt = str
    // 不换行代码块
    .replace(/`{3}(.+?)`{3}/g, (_, $1) => {
      let flag = false;
      $1 = $1
        .replace(/</g, "&lt")
        .replace(/>/g, "&gt")
        .replace(/\[\[([^\]\]]+?)\]\]{{([^}}]+?)}}/g, (_, i1, i2) => {
          flag = true;
          const code = getCode(i2);
          return `<span ${getCmdStr(code.cmd)}type="${code.type}">${i1}</span>`;
        });

      return flag
        ? `<code class='inline-exec'>${$1}</code>`
        : `<code>${$1}</code>`;
    })
    // 换行代码块
    .replace(/`{3}(.*)([^]+?)`{3}/g, (_, $1, $2) => {
      const classname = $1 ? `class="language-${$1}"` : "";
      $2 = $2
        .replace(/</g, "&lt")
        .replace(/>/g, "&gt")
        .replace(/\[\[([^(\]\])]+?)\]\]{{([^}}]+?)}}/g, (_, i1, i2) => {
          const code = getCode(i2);
          return `<span ${getCmdStr(code.cmd)}type="${code.type}">${i1}</span>`;
        })
        .replace(/^\n/g, "");

      return `<pre><code ${classname}>${$2}</code></pre>`;
    })
    // 行内代码
    .replace(/`([^`]+?)`/g, (_, $1) => {
      let flag = false;
      $1 = $1
        .replace(/</g, "&lt")
        .replace(/>/g, "&gt")
        .replace(/\[\[([^\]\]]+?)\]\]{{([^}}]+?)}}/g, (_, i1, i2) => {
          flag = true;
          const code = getCode(i2);
          return `<span ${getCmdStr(code.cmd)}type="${code.type}">${i1}</span>`;
        });
      return flag
        ? `<code class='inline-exec'>${$1}</code>`
        : `<code>${$1}</code>`;
    });

  if (parseFn) {
    rlt = parseFn(rlt);
  }

  return mkit.render(rlt);
}
