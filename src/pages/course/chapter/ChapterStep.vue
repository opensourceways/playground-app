<script setup>
import { ref } from "vue";

import ODropdown from "@/components/ODropdown.vue";
import ODropDownItem from "@/components/ODropdownItem.vue";
const props = defineProps({
  preveDisabed: {
    type: Boolean,
    default: false,
  },
  nextDisabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["prev-click", "next-click"]);

function handlePrevClick(e) {
  if (!props.preveDisabed) {
    emit("prev-click", e);
  }
}

function handleNextClick(e) {
  if (!props.nextDisabled) {
    emit("next-click", e);
  }
}

const triangleRotate = ref(false);
function handleToggle(val) {
  triangleRotate.value = val;
}
</script>

<template>
  <div class="chapter-step">
    <div class="prev" @click="handlePrevClick">
      <div class="arrow"></div>
    </div>
    <o-dropdown class="dropdown" @toggle="handleToggle">
      <div class="dropdown-tool">
        <div class="tool-lable">1/5</div>
        <div class="tool-icon">
          <div
            class="triangle"
            :class="{ 'triangle-rotate': triangleRotate }"
          ></div>
        </div>
      </div>

      <template #menu>
        <o-drop-down-item class="dropdown-item">1</o-drop-down-item>
        <o-drop-down-item class="dropdown-item">2</o-drop-down-item>
        <o-drop-down-item class="dropdown-item">3</o-drop-down-item>
        <o-drop-down-item class="dropdown-item">4</o-drop-down-item>
      </template>
    </o-dropdown>
    <div class="next" @click="handleNextClick">
      <div class="arrow"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chapter-step {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .prev,
  .next {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border: 1px solid #000000;

    .arrow {
      width: 10px;
      height: 10px;
      border-top: 1px solid #000;
      border-left: 1px solid #000;
    }
  }

  .prev {
    .arrow {
      transform: rotate(-45deg);
    }
  }

  .next {
    .arrow {
      transform: rotate(135deg);
    }
  }

  .dropdown {
    margin-left: 20px;
    margin-right: 20px;
    height: 32px;
    border: 1px solid rgba(0, 0, 0, 1);

    &-tool {
      padding: 4px 4px 4px 8px;
      display: flex;
      align-items: center;

      .tool-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;

        .triangle {
          width: 0;
          height: 0;
          border-width: 0 4px 7px;
          border-style: solid;
          border-color: transparent transparent #000000;
          transform: rotate(180deg);

          transition: transform cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;

          &.triangle-rotate {
            transform: rotate(0);
          }
        }
      }
    }
  }
}
</style>
