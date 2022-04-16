<script setup>
import { ref, watch } from "vue";
import useClickOutside from "./hooks/useClickOutside";

const dropdown = ref(null);
const tool = ref(null);
const menu = ref(null);

const isOpen = ref(false);
const menuHeight = ref(0);

const emit = defineEmits(["toggle"]);

function toggleMenu(flag) {
  if (typeof flag === "undefined" || typeof flag !== "boolean") {
    isOpen.value = !isOpen.value;
    emit("toggle", isOpen.value);
  } else {
    isOpen.value = flag;
  }
}

defineExpose({
  toggleMenu,
  isOpen,
});

const isClickOutside = useClickOutside(dropdown);

watch(
  () => {
    return isClickOutside.value;
  },
  (val) => {
    if (isOpen.value && val) {
      toggleMenu(false);
    }
  }
);

watch(
  () => {
    return isOpen.value;
  },
  (val) => {
    const height = menu.value.scrollHeight;
    if (val) {
      menuHeight.value = height;
    } else {
      menuHeight.value = 0;
    }
  }
);
</script>

<template>
  <div ref="dropdown" class="o-dropdown" :class="{ 'is-open': isOpen }">
    <div ref="tool" class="o-dropdown-tool" @click="toggleMenu">
      <slot></slot>
    </div>

    <ul
      ref="menu"
      class="o-dropdown-menu"
      :style="{
        height: `${menuHeight}px`,
        opacity: `${isOpen ? 1 : 0}`,
      }"
      @click.stop="toggleMenu(false)"
    >
      <slot name="menu"></slot>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.o-dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;

  &-tool {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-menu {
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    left: 0;
    min-width: 100%;
    top: calc(100% + 18px);
    border: 1px solid #7d32ea;
    z-index: 1;
    height: 0;
    transition: height cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s,
      opacity cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
  }
}
</style>
