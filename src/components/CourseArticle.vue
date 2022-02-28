<script setup>
const COMMAND_INNER = {
  exec: "RUN",
};

defineProps({
  content: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["click"]);
function onClick(e) {
  const { target } = e;
  let command = target.getAttribute("exec");
  if (command) {
    if (command === COMMAND_INNER.exec) {
      command = target.innerText;
    }
    emit("click", {
      e,
      command,
    });
  }
}
</script>
<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="course-article" @click="onClick" v-html="content"></div>
</template>
<style lang="scss">
.course-article {
  padding: 24px;

  font-size: 14px;
  line-height: 20px;
  color: #000;
  code {
    background-color: #e2e6f1;
    border-radius: 4px;
    padding: 0 4px;
    &[exec] {
      cursor: pointer;
      background-color: #dce6ff;
      color: blue;
      &:hover {
        background-color: #cbd6ee;
      }
      &:active {
        background-color: #dce5f8;
      }
    }
  }
  pre {
    background-color: #e2e6f1;
    padding: 8px;
    border-radius: 4px;

    code,
    code[exec] {
      margin: 0;
      padding: 0;
      background-color: transparent;
    }
  }
  h1 {
    font-size: 24px;
    margin: 24px 0 20px;
  }
  h2 {
    font-size: 20px;
    margin: 24px 0 16px;
  }
  p {
    margin: 12px 0;
  }
}
</style>
