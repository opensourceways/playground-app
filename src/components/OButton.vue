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
  padding: 11px 28px;
  line-height: 24px;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #333;
  outline: none;
  cursor: pointer;
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
    &:hover {
      color: #000000;
    }
    .icon {
      color: #0c41c9;
    }
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
      color: #eee;
      background-color: #c5c5c5;
      border-color: #c5c5c5;
    }
  }
  &.is-disabled,
  &.is-disabled:hover {
    color: #ffffff;
    background: #c5c5c5;
    border-color: #c5c5c5;
    cursor: not-allowed;
  }

  .wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    margin-left: 10px;
  }
}
</style>
