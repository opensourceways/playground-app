<script setup>
import {} from "vue";
defineProps({
  primary: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

function onClick(e) {
  emit("click", e);
}
</script>
<template>
  <button class="o-button" :class="{ primary: primary }" @click="onClick">
    <div class="wrap">
      <slot></slot>
      <svg-icon v-if="icon" class="icon" :name="icon"></svg-icon>
    </div>
  </button>
</template>
<style lang="scss">
.o-button {
  padding: 8px 16px;
  line-height: 32px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  &.primary {
    color: #fff;
    background-color: #002fa7;
    &:hover {
      background-color: #0c41c9;
    }
    &:active {
      background-color: #032783;
    }
  }
  .wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    margin-left: 8px;
  }
}
</style>
