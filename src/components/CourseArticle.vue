<script setup>
defineProps({
  content: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["click"]);
function onClick(e) {
  const { target } = e;
  const command = target.getAttribute("exec");
  if (command) {
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
  color: #000;
  code {
    background-color: #dce6ff;
    padding: 0 4px;
    margin: 0 4px;
    &[exec] {
      cursor: pointer;
      background-color: #dce6ff;
      &:hover {
        background-color: #cbd6ee;
      }
      &:active {
        background-color: #dce5f8;
      }
    }
  }
  pre {
    background-color: #dce6ff;
    padding: 8px;
    code {
      margin: 0;
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
