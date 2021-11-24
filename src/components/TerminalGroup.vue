<script setup>
import { ref, computed, reactive, onBeforeUpdate, nextTick } from "vue";
import Terminal from "./Terminal.vue";
import { updateRemainTime } from "@/pages/playground/remainTime";

defineProps({
  max: {
    type: Number,
    default: 20,
  },
});
const emit = defineEmits(["terminal-first-loaded"]);

const terminalList = reactive([]);
let isFirstLoadTerminal = true;
const activeTerminalList = computed(() => terminalList.filter((item) => item));

let terminalId = 0;
const currentId = ref(0);
const isFullscreen = ref(false);
let terminalRefs = [];

async function addTerminal() {
  terminalId += 1;
  terminalList.push({
    id: terminalId,
  });

  currentId.value = terminalId;

  return terminalId;
}

function closeTerminal(params) {
  const index = terminalList.findIndex((item) => {
    if (!item) {
      return false;
    }
    if (params.id) {
      return item.id === params.id;
    } else if (params.name) {
      return item.name === params.name;
    }
  });
  terminalList[index] = null;
}

function closeAllTerminal() {
  terminalList.length = 0;
}

function selectTerminal(id) {
  currentId.value = id;
}

function fullscreen(full = true) {
  isFullscreen.value = full;
  nextTick(() => {
    if (Array.isArray(terminalRefs)) {
      terminalRefs.forEach((term) => {
        term.fit();
      });
    }
  });
}

function add() {
  addTerminal();
}
function remove(ter) {
  closeTerminal({ id: ter.id });
}

function setItemRef(el) {
  terminalRefs.push(el);
}

onBeforeUpdate(() => {
  terminalRefs = [];
});

function onCreateResource(data, idx) {
  const { status } = data;
  if (status === 2) {
    activeTerminalList.value[idx].name = "创建失败";
  } else if (status === 1) {
    updateRemainTime(data.remainSecond);
    activeTerminalList.value[idx].name = data.name;

    if (isFirstLoadTerminal) {
      emit("terminal-first-loaded");
      isFirstLoadTerminal = false;
    }
  } else {
    activeTerminalList.value[idx].name = "创建中...";
  }
}

defineExpose({
  addTerminal,
  closeTerminal,
  closeAllTerminal,
  selectTerminal,
  fullscreen,
});
</script>

<template>
  <div class="oe-terminal-group" :class="{ fullscreen: isFullscreen }">
    <div class="terminal-head">
      <div class="head-navs-wrap">
        <div class="head-navs">
          <div
            v-for="ter in activeTerminalList"
            :key="ter.id"
            class="nav-item"
            :class="{ active: currentId === ter.id }"
            :title="ter.name"
            @click="selectTerminal(ter.id)"
          >
            <span class="label">{{ ter.name }}</span>
            <span class="btn-close" @click.stop="remove(ter)"
              ><svg-icon name="x"></svg-icon
            ></span>
          </div>
          <div
            v-if="max > activeTerminalList.length"
            class="btn-plus"
            @click.stop="add"
          >
            <svg-icon name="plus"></svg-icon>
          </div>
        </div>
      </div>
      <div class="tools">
        <div
          v-if="!isFullscreen"
          class="tool-item"
          @click.stop="fullscreen(true)"
        >
          <svg-icon name="maximize"></svg-icon>
        </div>
        <div
          v-if="isFullscreen"
          class="tool-item"
          @click.stop="fullscreen(false)"
        >
          <svg-icon name="minimize"></svg-icon>
        </div>
      </div>
    </div>
    <div class="terminal-list">
      <Terminal
        v-for="(ter, idx) in activeTerminalList"
        v-show="currentId === ter.id"
        :key="ter.id"
        :ref="setItemRef"
        class="terminal-item"
        @create-resource="(e) => onCreateResource(e, idx)"
      ></Terminal>
    </div>
  </div>
</template>

<style lang="scss">
.oe-terminal-group {
  --nav-height: 42px;

  height: 100%;
  background-color: #141414;

  &.fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
  }
  .terminal-head {
    display: flex;
    justify-content: space-between;
    .tools {
      display: flex;
      color: #ccc;
      align-items: center;
      padding-right: 8px;
    }
    .tool-item {
      font-size: 20px;
      padding: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }
  .head-navs-wrap {
    overflow: auto;
  }
  .head-navs {
    display: flex;
    align-items: center;
  }
  .nav-item {
    height: var(--nav-height);
    display: flex;
    align-items: center;
    padding: 0 32px 0 16px;
    font-size: 18px;
    color: #fff;
    min-width: 116px;
    text-align: center;
    cursor: default;
    position: relative;
    min-width: 120px;
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

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      background-color: #333;
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
    position: relative;
  }
  .terminal-item {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
}
</style>
