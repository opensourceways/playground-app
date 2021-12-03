<script setup>
import { ref, computed, reactive, onBeforeUpdate, nextTick } from "vue";
import Terminal, { RES_STATUS } from "./Terminal.vue";

const props = defineProps({
  max: {
    type: Number,
    default: 20,
  },
  resource: {
    type: Object,
    default() {
      return null;
    },
  },
});

const emit = defineEmits(["terminal-loaded", "terminal-disconnect"]);

const terminalList = reactive([]);
let isFirstLoadTerminal = true;
const activeTerminalList = computed(() => terminalList.filter((item) => item));

let terminalId = 0;
const currentId = ref(0);
const isFullscreen = ref(false);
let terminalRefs = [];

async function addTerminal(isNew) {
  terminalId += 1;
  terminalList.push({
    id: terminalId,
    name: `Terminal${terminalId}`,
    isNew,
    config: props.resource,
  });

  currentId.value = terminalId;

  return terminalId;
}

function disconnectTerminal(params) {
  const index = activeTerminalList.value.findIndex(
    (item) => item.id === params.id
  );
  if (index > -1) {
    terminalRefs[index].disconnect();
  }
}
function disconnectAllTerminal() {
  isFirstLoadTerminal = true;
  terminalRefs.forEach((item) => item.disconnect());
}

function closeTerminal(params) {
  let index = terminalList.findIndex((item) => {
    if (!item) {
      return false;
    }
    if (params.id) {
      return item.id === params.id;
    } else if (params.name) {
      return item.name === params.name;
    }
  });
  // 激活后一个tab，如果已经在最后一个，就激活前一个tab
  const aIndex = activeTerminalList.value.findIndex(
    (item) => item.id === params.id
  );
  if (aIndex === activeTerminalList.value.length - 1) {
    if (aIndex - 1 < 0) {
      // 删除唯一的tab
      currentId.value = "";
    } else {
      currentId.value = activeTerminalList.value[aIndex - 1].id;
    }
  } else {
    currentId.value = activeTerminalList.value[aIndex + 1].id;
  }
  terminalList[index] = null;
}

function closeAllTerminal() {
  terminalList.length = 0;
  isFirstLoadTerminal = true;
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

function onResourceStatus(data, idx) {
  if (!activeTerminalList.value[idx]) {
    return;
  }

  const { status } = data;
  activeTerminalList.value[idx].status = status;

  if (status === RES_STATUS.DONE) {
    emit("terminal-loaded", { isFirst: isFirstLoadTerminal, terminal: data });

    if (isFirstLoadTerminal) {
      isFirstLoadTerminal = false;
    }
  } else if (status === RES_STATUS.CONNECT_FAILED) {
    emit("terminal-disconnect");
  }
}

function enterCommond(commond) {
  if (!currentId.value) {
    return;
  }
  const index = activeTerminalList.value.findIndex(
    (item) => item.id === currentId.value
  );

  terminalRefs[index].enter(commond);
}

defineExpose({
  addTerminal,
  closeTerminal,
  closeAllTerminal,
  selectTerminal,
  fullscreen,
  enterCommond,
  disconnectTerminal,
  disconnectAllTerminal,
});
</script>

<template>
  <div class="open-terminal-group" :class="{ fullscreen: isFullscreen }">
    <div class="terminal-head">
      <div class="head-navs-wrap">
        <div class="head-navs">
          <div
            v-for="ter in activeTerminalList"
            :key="ter.id"
            class="nav-item"
            :class="[
              currentId === ter.id ? 'active' : '',
              `status-${ter.status}`,
            ]"
            :title="ter.name"
            @click="selectTerminal(ter.id)"
          >
            <span class="label">{{ ter.name }}</span>
            <i class="status-dot"></i>
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
        :is-new="ter.isNew"
        :config="ter.config"
        class="terminal-item"
        @resource-status="(e) => onResourceStatus(e, idx)"
      ></Terminal>
    </div>
  </div>
</template>

<style lang="scss">
.open-terminal-group {
  --nav-height: 42px;

  height: 100%;
  background-color: #000;

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
    background-color: #383737;

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
    height: var(--nav-height);
  }
  .nav-item {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 32px 0 16px;
    font-size: 16px;
    color: #fff;
    min-width: 116px;
    text-align: center;
    cursor: default;
    position: relative;
    min-width: 120px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1px;
      right: 0;
      background-color: #222;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    &:hover {
      &::before {
        opacity: 1;
      }
    }
    &.active {
      background-color: #000;
      &::before {
        opacity: 0;
      }
    }
    .label {
      position: relative;
      z-index: 2;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      left: 4px;
      top: 4px;
      z-index: 10;
      background-color: currentColor;
      color: #03ef03;
    }
    &.status-0 {
      .status-dot {
        color: #03ef03;
      }
    }
    &.status-1 {
      .status-dot {
        display: none;
      }
    }
    &.status-2,
    &.status-3 {
      .status-dot {
        color: #ffed00;
      }
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
