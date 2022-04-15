<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <li class="o-dropdown-item" :class="{ disabled: disabled }">
    <slot></slot>
  </li>
</template>

<style lang="scss" scoped>
.o-dropdown-item {
  padding: 0 20px;
  list-style: none;
  font-size: 14px;
  line-height: 48px;
  font-weight: normal;
  background: #ffffff;
  color: #000000;
  white-space: nowrap;

  cursor: pointer;

  & + .o-dropdown-item {
    border-top: none;
  }

  &:hover {
    background: #002fa7;
    color: #ffffff;
  }

  &.diabled {
    pointer-events: none;
    color: gray;
    background: transparent;

    &:hover {
      color: gray;
      background: transparent;
    }
  }
}
</style>
