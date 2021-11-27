<script setup>
import { useAttrs } from "vue";
defineProps({
  close: {
    type: Boolean,
    default: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});
const attrs = useAttrs();

const emit = defineEmits(["close-click"]);

function onCloseClick() {
  emit("close-click");
}
</script>
<template>
  <teleport to="body">
    <div class="o-dialog" :class="{ show: show, hide: !show }" v-bind="attrs">
      <div class="dialog-mask"></div>
      <div class="dialog-wrap">
        <div v-if="close" class="close-btn" @click="onCloseClick">
          <svg-icon name="x"></svg-icon>
        </div>
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
  </teleport>
</template>
<style lang="scss">
@keyframes o-dialog-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes o-dialog-wrap-show {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.o-dialog {
  visibility: hidden;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &.show {
    opacity: 1;
    visibility: visible;
    animation: o-dialog-show 0.3s;

    .dialog-wrap {
      animation: o-dialog-wrap-show 0.3s ease-in-out;
    }
  }

  .dialog-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    background-color: rgba($color: #000000, $alpha: 0.6);
  }

  .dialog-wrap {
    position: relative;
    z-index: 1;
    background-color: #fff;
    min-width: 550px;
    box-shadow: 0px 13px 33px 0px rgba(190, 196, 204, 0.2);
  }
  .dialog-body {
    padding: 24px 36px;
  }
  .dialog-head {
    padding: 24px 36px 16px;
    font-size: 24px;
    color: #000;
    text-align: left;
  }
  .dialog-foot {
    padding: 16px 36px 36px;
  }
  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 8px;
    cursor: pointer;
    z-index: 1;
    &:hover {
      color: #002fa7;
    }
  }
}
</style>
