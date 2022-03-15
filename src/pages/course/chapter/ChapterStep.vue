<script setup>
import { computed, ref } from "vue";

import ODropdown from "@/components/ODropdown.vue";
import ODropDownItem from "@/components/ODropdownItem.vue";

const props = defineProps({
  prevDisabled: {
    type: Boolean,
    default: false,
  },
  nextDisabled: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 1,
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["prev-click", "next-click", "item-click"]);

function handlePrevClick(e) {
  if (!props.prevDisabled) {
    emit("prev-click", e);
  }
}

function onItemClick(idx) {
  emit("item-click", idx);
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

const label = computed(() => {
  return `${props.activeIndex}/${props.count}`;
});

const data = new Array(props.count).fill(null).map((item, idx) => {
  return {
    id: `${idx}`,
    text: `${idx + 1}`,
  };
});
</script>

<template>
  <div class="chapter-step">
    <div
      class="prev"
      :class="{ 'is-disabled': prevDisabled }"
      @click="handlePrevClick"
    >
      <div class="arrow"></div>
    </div>
    <o-dropdown class="dropdown" @toggle="handleToggle">
      <div class="dropdown-tool">
        <div class="tool-lable">{{ label }}</div>
        <div class="tool-icon">
          <div
            class="triangle"
            :class="{ 'triangle-rotate': triangleRotate }"
          ></div>
        </div>
      </div>

      <template #menu>
        <o-drop-down-item
          v-for="(item, idx) in data"
          :key="item.id"
          class="dropdown-item"
          @click="onItemClick(idx)"
          >{{ item.text }}</o-drop-down-item
        >
      </template>
    </o-dropdown>
    <div
      class="next"
      :class="{ 'is-disabled': nextDisabled }"
      @click="handleNextClick"
    >
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
    cursor: pointer;

    .arrow {
      width: 10px;
      height: 10px;
      border-top: 1px solid #000;
      border-left: 1px solid #000;
    }

    &.is-disabled {
      border: 1px solid #c5c5c5;

      .arrow {
        border-top: 1px solid #c5c5c5;
        border-left: 1px solid #c5c5c5;
      }
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
      min-width: 60px;
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
