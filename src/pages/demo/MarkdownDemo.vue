<script setup>
import CourseArticle from "@/components/CourseArticle.vue";
import { handleMarkdown } from "@/shared/handle-markdown";
import { watch, ref } from "vue";

const initStr = `
## 行内代码
- 行内代码\`git init\`行内代码
- 行内可执行代码\`git init\`{{RUN|git init}} 行内可执行代码\`git init\`{{RUN}}
- 行内可打印代码\`git init\`{{PRINT|git init}} 行内可点击代码\`git init\`{{PRINT}}

## 多行代码块

- 多行代码块

\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

- 可执行多行代码块

\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`{{RUN|git clone https://gitee.com/devin-cwd/openeuler-docs.git git push}}

- 可打印多行代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`{{PRINT|git clone https://gitee.com/devin-cwd/openeuler-docs.git git push}}

- 分行可执行多行代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
\`\`\`{{RUN|git clone https://gitee.com/devin-cwd/openeuler-docs.git}}
\`\`\`
git push
\`\`\`{{RUN}}

- 分行可打印多行代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
\`\`\`{{PRINT|git clone https://gitee.com/devin-cwd/openeuler-docs.git}}
\`\`\`
git push
\`\`\`{{PRINT}}

- sh代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

- sh分行可执行代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
\`\`\`{{RUN}}
\`\`\`
git push
\`\`\`{{RUN}}

- bash代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

- bash分行可执行代码块
\`\`\`bash
git clone https://gitee.com/devin-cwd/openeuler-docs.git
\`\`\`{{RUN}}
\`\`\`
git push
\`\`\`{{RUN}}
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
