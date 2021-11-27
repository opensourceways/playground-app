<script setup>
const title = "温馨提示";
const contents = [
  { label: "复制", value: "ctrl + insert" },
  {
    label: "粘贴",
    value: "shift + insert",
  },
];
</script>

<template>
  <div class="warm-tips">
    <div class="title">{{ title }}</div>
    <div class="tip-list">
      <div v-for="item in contents" :key="item.value" class="tip-item">
        <span class="label">{{ item.label }}</span>
        <div class="value">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.warm-tips {
  .title {
    font-size: 18px;
    color: #000;
    margin-bottom: 10px;
  }
  .tip-list {
    display: flex;
    flex-wrap: wrap;
  }
  .tip-item {
    width: 50%;
    display: flex;
    color: #666;
    font-size: 14px;
    .value {
      margin-left: 8px;
    }
  }
}
</style>
