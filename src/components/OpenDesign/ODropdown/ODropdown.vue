<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const dropdown = ref(null);
const tool = ref(null);
const menu = ref(null);

const showMenu = ref(false);

function toggleMenu() {
  slide();
  showMenu.value = !showMenu.value;
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
  const isOpen = tool.value.classList.contains("open");
  const menuHeight = menu.value.scrollHeight;

  if (isOpen) {
    tool.value.classList.remove("open");
    setAni(menu.value, "height", "0px", 300);
  } else {
    tool.value.classList.add("open");
    setAni(menu.value, "height", `${menuHeight}px`, 300);
  }
}

function setAni(dom, attribute, value, time) {
  dom.style.transition = `${attribute} ${time}ms`;
  dom.style[attribute] = value;
}

onMounted(() => {
  window.addEventListener("click", handleClick);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClick);
});
</script>

<template>
  <div ref="dropdown" class="o-dropdown">
    <div ref="tool" class="dropdown-tool" @click.stop="toggleMenu">
      <slot></slot>
    </div>

    <ul ref="menu" class="dropdown-menu" @click.stop="toggleMenu">
      <slot name="menu"></slot>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.o-dropdown {
  position: relative;

  .dropdown-tool {
    display: flex;
    align-items: center;
  }
  .dropdown-menu {
    position: absolute;
    height: 0;
    overflow: hidden;
    left: 0;
    top: calc(100% + 18px);
    z-index: 1;
  }
}
</style>
