<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const dropdown = ref(null);
const tool = ref(null);
const menu = ref(null);

const showMenu = ref(false);
const menuHeight = ref(0);

const emit = defineEmits(["toggle"]);

function toggleMenu(flag) {
  if (typeof flag === "undefined" || typeof flag !== "boolean") {
    showMenu.value = !showMenu.value;
    emit("toggle", showMenu.value);
  } else {
    showMenu.value = flag;
  }
}

function onClick(e) {
  if (!showMenu.value) {
    return;
  }
  if (!dropdown.value.contains(e.target)) {
    toggleMenu(false);
  }
}

defineExpose({
  toggleMenu,
});

watch(
  () => {
    return showMenu.value;
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

onMounted(() => {
  window.addEventListener("click", onClick);
});

onUnmounted(() => {
  window.removeEventListener("click", onClick);
});
</script>

<template>
  <div ref="dropdown" class="o-dropdown">
    <div ref="tool" class="o-dropdown-tool" @click="toggleMenu">
      <slot></slot>
    </div>

    <!-- <transition name="fade"> -->
    <ul
      ref="menu"
      class="o-dropdown-menu"
      :style="{ height: `${menuHeight}px` }"
      @click.stop="toggleMenu(false)"
    >
      <slot name="menu"></slot>
    </ul>
    <!-- </transition> -->
  </div>
</template>

<style lang="scss" scoped>
.o-dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;

  &-menu {
    position: absolute;
    overflow: hidden;
    left: 0;
    top: calc(100% + 18px);
    z-index: 1;
    height: 0;
    transition: height cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
  }
}
</style>
