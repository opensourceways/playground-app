<script setup>
const props = defineProps({
  primary: {
    type: Boolean,
    default: false,
  },
  isText: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

function onClick(e) {
  if (props.disabled) {
    return;
  }
  emit("click", e);
}
</script>
<template>
  <button
    class="o-button"
    :class="{ primary: primary, 'is-text': isText, 'is-disabled': disabled }"
    @click="onClick"
  >
    <div class="wrap">
      <slot></slot>
      <svg-icon v-if="icon" class="icon" :name="icon"></svg-icon>
    </div>
  </button>
</template>
<style lang="scss">
.o-button {
  padding: 7px 16px;
  line-height: 32px;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #333;
  outline: none;
  cursor: pointer;
  color: #333;
  min-width: 120px;
  transition: color 0.2s, background-color 0.3s, border-color 0.3s;
  &:hover {
    border-color: #0c41c9;
    color: #0c41c9;
  }
  &:active {
    border-color: #032783;
  }

  &.is-text {
    border-color: transparent;
    min-width: auto;
    padding: 0;
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
    &.is-disabled,
    &.is-disabled:hover {
      background-color: #b8d9ff;
      border-color: #b8d9ff;
      color: #eee;
    }
  }
  &.is-disabled,
  &.is-disabled:hover {
    color: #999;
    border-color: #999;
    cursor: not-allowed;
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
