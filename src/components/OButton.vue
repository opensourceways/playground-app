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
  border: 1px solid #c3cedf;
  outline: none;
  cursor: pointer;
  &:hover {
    border-color: #0c41c9;
  }
  &:active {
    border-color: #032783;
  }
  &.primary {
    color: #fff;
    border-color: #002fa7;
    background-color: #002fa7;
    &:hover {
      border-color: #0c41c9;
      background-color: #0c41c9;
    }
    &:active {
      border-color: #032783;
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
