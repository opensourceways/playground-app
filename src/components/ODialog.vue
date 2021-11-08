<script setup>
import { ref } from "vue";
defineProps({});

const isShow = ref(false);

function show() {
  isShow.value = true;
}
function hide() {
  isShow.value = false;
}
function toggle(val) {
  if (val) {
    isShow.value = val;
  } else {
    isShow.value = !isShow.value;
  }
}

defineExpose({
  show,
  toggle,
  hide,
});
</script>
<template>
  <div class="o-dialog" :class="{ show: isShow }">
    <div class="dialog-mask"></div>
    <div class="dialog-main">
      <div class="dialog-head">
        <slot name="head"></slot>
      </div>
      <div class="dialog-body">
        <slot></slot>
      </div>
      <div class="dialog-foot">
        <slot name="foot"></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.o-dialog {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &.show {
    opacity: 1;
    visibility: visible;
  }
  .dialog-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    background-color: rgba($color: #000000, $alpha: 0.3);
  }
  .dialog-main {
    position: relative;
    z-index: 1;
    background-color: #fff;
    max-width: 550px;
    box-shadow: 0px 13px 33px 0px rgba(190, 196, 204, 0.2);
  }
  .dialog-body {
    padding: 24px 40px;
  }
}
</style>
