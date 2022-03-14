<script setup>
import { onMounted, ref } from "vue";
const progress = ref(null); //进度条
const processHeight = ref(0); //进度条高度
const box = ref(null); // 自定义滚动条盒子
const bar = ref(null); // 滚动条
const barHeight = 80; // 滚动条高度

let force = false; // 滚动条是否被鼠标光标按住
/**
 * 鼠标滚轮
 */
function handleMouseWheel(e) {
  e.preventDefault();
  const eventDelta = e.wheelDelta || -e.deltaY * 40; // 火狐和其他浏览器都兼容
  box.value.scrollTop -= eventDelta / 4;
  processHeight.value =
    (box.value.scrollTop / box.value.scrollHeight) *
    barHeight *
    (1 +
      box.value.clientHeight /
        (box.value.scrollHeight - box.value.clientHeight));
}
/**
 * 鼠标按下
 */
function handleMouseDown(e) {
  e.preventDefault();
  if (e.target === bar.value || e.target === progress.value) {
    force = true;
  }
}
/**
 * 鼠标按键释放
 */
function handleMouseUp() {
  force = false;
}
/**
 * 鼠标移动
 */
function handleMouseMove(e) {
  if (force && e.offsetY >= 0 && e.offsetY <= barHeight) {
    e.preventDefault();
    processHeight.value = e.offsetY;
    box.value.scrollTop =
      (processHeight.value / barHeight) *
      (box.value.scrollHeight - box.value.clientHeight);
  }
}
/**
 * 点击进度条
 */
function handleClick(e) {
  processHeight.value = e.offsetY;
  box.value.scrollTop =
    (processHeight.value / barHeight) *
    (box.value.scrollHeight - box.value.clientHeight);
}

onMounted(() => {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousemove", handleMouseMove);
});
</script>

<template>
  <div
    ref="box.value"
    class="o-scroll"
    @wheel="handleMouseWheel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="bar"
      class="scroll-bar"
      :style="{ height: barHeight + 'px' }"
      @click="handleClick"
      @mousedown="handleMouseDown"
    >
      <div
        ref="progress"
        class="progress-bar"
        :style="{ height: processHeight + 'px' }"
      ></div>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
// 滚动条宽度
$scrollbar-width: 6px;

.o-scroll {
  width: 100%;
  height: 100%;
  position: relative;
  padding-right: $scrollbar-width;
  overflow-y: hidden;
}
.scroll-bar {
  cursor: pointer;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 50%;
  left: 100%;
  width: $scrollbar-width;
  height: 100%;
  transform: translateY(-100%);
  border: 1px solid darkgray;
  background-color: darkgray;
  overflow: hidden;
  border-radius: calc($scrollbar-width / 2);
  &:hover {
    background-color: gray;
  }
  .progress-bar {
    width: 100%;
    background-color: #fff;
    border-radius: calc($scrollbar-width / 2);
  }
}
</style>
