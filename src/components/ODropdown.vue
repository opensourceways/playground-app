<script setup>
import { ref } from "vue";
const showMenu = ref(false);

function toggleMenu(flag) {
  if (flag === undefined) {
    showMenu.value = !showMenu.value;
  } else {
    showMenu.value = flag;
  }
}
</script>

<template>
  <div class="o-dropdown">
    <div class="dropdown-tool" @click="toggleMenu(!showMenu)">
      <slot></slot>
    </div>

    <div
      v-show="showMenu"
      class="dropdown-popper"
      @click="toggleMenu(!showMenu)"
    >
      <slot name="menu"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-dropdown {
  position: relative;

  .dropdown-tool {
    display: flex;
    align-items: center;
  }
  .dropdown-popper {
    position: absolute;
    left: 0;
    top: calc(100% + 18px);
    z-index: 1;
  }
}
</style>
