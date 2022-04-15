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
          <svg-icon name="x" size="small"></svg-icon>
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
  position: fixed;
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

  .dialog {
    &-mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 0;
      background-color: rgba($color: #000000, $alpha: 0.6);
    }

    &-wrap {
      position: relative;
      z-index: 1;
      background-color: #fff;
      min-width: 550px;
      box-shadow: 0px 13px 33px 0px rgba(190, 196, 204, 0.2);
      @media screen and (max-width: 1023px) {
        min-width: auto;
        width: 90%;
      }
    }

    &-head {
      padding: 40px 40px 8px;
      font-size: 24px;
      line-height: 32px;
      text-align: left;
      @media screen and (max-width: 1023px) {
        padding: 24px 24px 4px;
        font-size: 18px;
      }
    }

    &-body {
      padding: 8px 40px;
      font-size: 14px;
      line-height: 22px;
      @media screen and (max-width: 1023px) {
        padding: 4px 24px;
      }
    }

    &-foot {
      padding: 40px 40px 24px;
    }
  }

  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 8px;
    cursor: pointer;
    z-index: 1;
    line-height: 1;
    font-size: 24px;
    &:hover {
      color: #002fa7;
    }
  }
}
</style>
