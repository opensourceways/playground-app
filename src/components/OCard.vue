<script setup>
defineProps({
  bodyStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<template>
  <div class="o-card">
    <div v-if="$slots.header" class="o-card-header">
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.default" class="o-card-body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-card-header {
  padding: 32px;
  background-color: #ffffff;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.o-card-body {
  padding: 32px;
}
</style>
