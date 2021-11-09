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
const currentId = ref(0);

function addTerminal(params) {
  terminalId += 1;
  terminalList.push({
    id: terminalId,
    name: (params && params.name) || "终端" + terminalId,
  });

  currentId.value = terminalId;

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

function selectTerminal(id) {
  currentId.value = id;
}

defineExpose({
  addTerminal,
  closeTerminal,
  selectTerminal,
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
        <div
          v-for="ter in terminalList"
          :key="ter.id"
          class="nav-item"
          :class="{ active: currentId === ter.id }"
          @click="selectTerminal(ter.id)"
        >
          <span class="label">{{ ter.name }}</span>
          <span class="btn-close" @click.stop="remove(ter)"
            ><svg-icon name="x"></svg-icon
          ></span>
        </div>
        <div
          v-if="max > terminalList.length"
          class="btn-plus"
          @click.stop="add"
        >
          <svg-icon name="plus"></svg-icon>
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
    line-height: var(--nav-height);
    font-size: 18px;
    color: #fff;
    min-width: 116px;
    padding: 0 24px;
    text-align: center;
    cursor: default;
    position: relative;
    &::after {
      content: "";
      border-right: 1px solid #444;
      position: absolute;
      top: 8px;
      bottom: 8px;
      right: 0;
      z-index: 0;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1px;
      right: 0;
      background-color: #383733;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    &:hover {
      // background-color: #383733;
      &::before {
        opacity: 1;
      }
    }
    &.active {
      background-color: #464643;
    }
    .label {
      position: relative;
      z-index: 2;
    }
  }
  .btn-plus {
    line-height: 42px;
    font-size: 24px;
    margin: 0 8px;
    width: 32px;
    height: 32px;
    color: #bbb;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: #fff;
      background-color: #111;
      border-radius: 50%;
    }
  }
  .btn-close {
    color: #ccc;
    position: absolute;
    right: 8px;
    line-height: 16px;
    width: 20px;
    height: 20px;
    top: 50%;
    margin-top: -10px;
    z-index: 3;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    &:hover {
      background-color: #111;
      border-radius: 50%;
    }
  }
  .terminal-list {
    height: calc(100% - var(--nav-height));
  }
}
</style>
