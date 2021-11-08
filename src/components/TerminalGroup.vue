<script setup>
import { ref, onMounted, reactive } from "vue";
import Terminal from "./Terminal.vue";

defineProps({
  max: {
    type: Number,
    default: 20,
  },
});

const terminalList = reactive([]);
let terminalId = 0;

function addTerminal(params) {
  terminalId += 1;
  terminalList.push({
    id: terminalId,
    name: (params && params.name) || "终端" + terminalId,
  });

  return terminalId;
}

function closeTerminal(params) {
  const index = terminalList.findIndex((item) => {
    if (params.id) {
      return item.id === params.id;
    } else if (params.name) {
      return item.name === params.name;
    }
  });
  terminalList.splice(index, 1);
}

defineExpose({
  addTerminal,
  closeTerminal,
});

function add() {
  addTerminal();
}
function remove(ter) {
  closeTerminal({ id: ter.id });
}
</script>

<template>
  <div class="oe-terminal-group">
    <div class="head-navs-wrap">
      <div class="head-navs">
        <div v-for="ter in terminalList" :key="ter.id" class="nav-item">
          <span>{{ ter.name }}</span>
          <span class="btn-close" @click="remove(ter)">x</span>
        </div>
        <div v-if="max > terminalList.length" class="btn-plus" @click="add">
          +
        </div>
      </div>
    </div>
    <div class="terminal-list">
      <Terminal v-for="ter in terminalList" :key="ter.id"></Terminal>
    </div>
  </div>
</template>

<style lang="scss">
.oe-terminal-group {
  --nav-height: 42px;

  height: 100%;
  background-color: #141414;
  .head-navs-wrap {
    overflow: auto;
  }
  .head-navs {
    background-color: #222222;
    display: flex;
    align-items: center;
  }
  .nav-item {
    background-color: #383733;
    line-height: var(--nav-height);
    font-size: 18px;
    color: #fff;
    min-width: 116px;
    padding: 0 24px;
    text-align: center;
    cursor: default;
    position: relative;
    &:hover {
      background-color: #4b4944;
    }
  }
  .btn-plus {
    line-height: 42px;
    font-size: 24px;
    color: #bbb;
    padding: 0 12px;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
  .btn-close {
    color: #ccc;
    position: absolute;
    right: 8px;
    line-height: 16px;
    width: 16px;
    font-size: 14px;
    top: 50%;
    margin-top: -8px;
    &:hover {
      background-color: #333;
      border-radius: 50%;
    }
  }
  .terminal-list {
    height: calc(100% - var(--nav-height));
  }
}
</style>
