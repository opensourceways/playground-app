<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const dropdown = ref(null);
const tool = ref(null);
const menu = ref(null);

const showMenu = ref(false);

const menuHeight = ref(0);

function toggleMenu(flag) {
  if (typeof flag === "undefined" || typeof flag !== "boolean") {
    showMenu.value = !showMenu.value;
  } else {
    showMenu.value = flag;
  }
}

function handleClick(e) {
  if (!showMenu.value) {
    return;
  }

  if (!dropdown.value.contains(e.tartget)) {
    showMenu.value = false;
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
  window.addEventListener("click", handleClick);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClick);
});
</script>

<template>
  <div ref="dropdown" class="o-dropdown">
    <div ref="tool" class="o-dropdown-tool" @click.stop="toggleMenu">
      <slot></slot>
    </div>

    <ul
      ref="menu"
      class="o-dropdown-menu"
      :style="{ height: `${menuHeight}px` }"
      @click.stop="toggleMenu(false)"
    >
      <slot name="menu"></slot>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.o-dropdown {
  position: relative;
  &-tool {
    display: flex;
    align-items: center;
  }
  &-menu {
    position: absolute;
    height: 0;
    overflow: hidden;
    left: 0;
    top: calc(100% + 18px);
    z-index: 1;
    transition: height 0.3s;
  }
}
</style>
