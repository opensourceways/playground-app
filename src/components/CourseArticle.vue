<script setup>
defineProps({
  content: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["command-click"]);
function onClick(e) {
  const { target } = e;
  let command = target.getAttribute("exec");
  let type = target.getAttribute("type");
  if (command || type) {
    if (!type) {
      type = "print";
    }
    if (!command) {
      command = target.innerText;
    }

    emit("command-click", {
      e,
      command,
      type,
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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #555555;
  code {
    background-color: #eceff0;
    // border-radius: 4px;
    padding: 0 4px;
    &[exec],
    &[type] {
      cursor: pointer;
      background-color: #d7e2ff;
      // color: blue;
      word-break: break-all;
      &:hover {
        background-color: #cbd6ee;
      }
      &:active {
        background-color: #dce5f8;
      }
    }
  }
  pre {
    overflow-x: auto;
    background-color: #e2e6f1;
    padding: 8px;
    border-radius: 4px;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #d8d8d8;
      background-clip: content-box;
    }

    &::-webkit-scrollbar-track {
      border-radius: 3px;
      box-shadow: inset 0 0 2px rgba($color: #000000, $alpha: 0.2);
      background: #ffffff;
      // background:transparent;
    }

    code,
    code[exec],
    code[type] {
      margin: 0;
      padding: 0;
      background-color: transparent;
    }
  }
  h1 {
    font-size: 24px;
    line-height: 32px;
    margin: 24px 0 20px;
  }
  h2 {
    font-size: 18px;
    line-height: 24px;
    margin: 24px 0 16px;
  }
  p {
    margin: 16px 0;
  }
  img {
    max-width: 100%;
  }
  ol {
    li {
      list-style: none;
    }
  }
  code:first-child,
  pre:first-child,
  h1:first-child,
  h2:first-child,
  p:first-child {
    margin-top: 0;
  }

  code:last-child,
  pre:last-child,
  h1:last-child,
  h2:last-child,
  p:last-child {
    margin-bottom: 0;
  }
}
</style>
