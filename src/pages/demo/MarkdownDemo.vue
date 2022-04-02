<script setup>
import CourseArticle from "@/components/CourseArticle.vue";
import { handleMarkdown } from "@/shared/handle-markdown";
import { watch, ref } from "vue";

const initStr = `
## 行内代码
- 行内代码\`git init\`行内代码
- 行内可执行代码\`[[git init]]{{RUN}}\` 行内可执行代码\`[[git init]]{{RUN|git init}}\`
- 行内可打印代码\`[[git init]]{{PRINT}}\` 行内可打印代码\`[[git init]]{{PRINT|git init}}\`
- 行内可打印代码\`[[git config --global user.name]]{{PRINT}} "your name"\`

## 多行代码块

- 多行代码块

\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

- 可执行多行代码块

\`\`\`
[[git clone https://gitee.com/devin-cwd/openeuler-docs.git]]{{RUN}}
[[git push]]{{RUN|git push}}
\`\`\`

- 可打印多行代码块
\`\`\`
[[git clone https://gitee.com/devin-cwd/openeuler-docs.git]]{{PRINT}}
[[git push]]{{PRINT|git push}}
\`\`\`

- sh代码块
\`\`\`shell
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

- bash代码块
\`\`\`bash
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

## 兼容测试

<code type="run" exec="git clone">git clone</code>
<code class="inline-exec"><span type="run" exec="git push">git push</span></code>
`;

const codeString = ref(initStr);
const result = ref(handleMarkdown(codeString.value));

watch(
  () => codeString.value,
  (val) => {
    console.log(val);
    result.value = handleMarkdown(val);
  }
);

function exec(e) {
  console.log(e.command);
  alert(`type: ${e.type}\n${e.command}`);
}
</script>

<template>
  <div class="page-demo">
    <div class="section">
      <h3>Markdown</h3>
      <textarea
        id=""
        v-model="codeString"
        name="src"
        cols="30"
        rows="10"
      ></textarea>
    </div>
    <div class="section">
      <h3>Html</h3>
      <CourseArticle
        class="html"
        :content="result"
        @command-click="exec"
      ></CourseArticle>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-demo {
  display: flex;
  padding: 60px;
  min-height: calc(100vh - 80px);
}

textarea {
  font-size: smaller;
}
.section {
  flex: 1;
  + .section {
    margin-left: 24px;
  }

  .html {
    background-color: #fafafa;
  }
  h3 {
    margin-bottom: 16px;
  }

  textarea {
    width: 100%;
    padding: 16px;
    height: 100%;
    line-height: 24px;
    border-color: #eee;
  }
}
</style>
