<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const dropdown = ref(null);
const tool = ref(null);
const menu = ref(null);

const showMenu = ref(false);

const menuHeight = ref(0);

function toggleMenu(flag) {
  // if (flag === undefined) {
  //   slide();
  //   showMenu.value = !showMenu.value;
  // } else {
  //   if (showMenu.value === flag) {
  //     return;
  //   }
  slide();
  showMenu.value = flag;
  // }
}

function handleClick(e) {
  if (!showMenu.value) {
    return;
  }

  if (!dropdown.value.contains(e.tartget)) {
    slide();
    showMenu.value = false;
  }
}

function slide() {
  const height = menu.value.scrollHeight;

  if (showMenu.value) {
    menuHeight.value = 0;
  } else {
    menuHeight.value = height;
  }
}

defineExpose({
  toggleMenu,
  showMenu,
});

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
      @click.stop="toggleMenu"
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
