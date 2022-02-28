<script setup>
import CourseArticle from "@/components/CourseArticle.vue";
import { handleMarkdown } from "@/shared/handle-markdown";
import { watch, ref } from "vue";

const initStr = `## 行内代码
行内代码\`git clone\`行内代码

行内可点击代码\`git clone\`{{git clone}}行内可点击代码

## 多行代码块

可点击代码块

\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`{{RUN}}

代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
\`\`\`

sh代码块
\`\`\`
git clone https://gitee.com/devin-cwd/openeuler-docs.git
git push
\`\`\`

bash代码块
\`\`\`bash
git clone https://gitee.com/devin-cwd/openeuler-docs.git
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
  alert(e.command);
}
</script>
<template>
  <div class="page-demo">
    <div class="section">
      <textarea
        id=""
        v-model="codeString"
        name="src"
        cols="30"
        rows="10"
      ></textarea>
    </div>
    <div class="section">
      <CourseArticle :content="result" @click="exec"></CourseArticle>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-demo {
  display: flex;
  padding: 60px;
  height: calc(100vh - 80px);
}
.section {
  flex: 1;
  background-color: #fafafa;
  + .section {
    margin-left: 24px;
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
