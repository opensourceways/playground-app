<script setup>
import OButton from "@/components/OButton.vue";
defineProps({
  contents: {
    type: Array,
    default() {
      return [];
    },
  },
});
</script>

<template>
  <div class="oe-article">
    <div v-for="item in contents" :key="item.id" class="section">
      <div v-if="item.title" class="title">{{ item.title }}</div>
      <div v-if="item.detail" class="detail">{{ item.detail }}</div>
      <div v-if="item.buttons" class="buttons">
        <o-button
          v-for="btn in item.buttons"
          :key="btn.label"
          :icon="btn.icon"
          :primary="btn.primary"
          @click="btn.click(btn)"
          >{{ btn.label }}</o-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.oe-article {
  padding: 40px;
  font-size: 16px;
  line-height: 24px;
  color: #333;
  text-align: justify;
}
.section {
  .title {
    font-size: 18px;
    color: #000;
    font-weight: 500;
    + .detail {
      margin-top: 20px;
    }
  }
  + .section {
    margin-top: 40px;
  }
}
.o-button {
  min-width: 140px;
}
</style>
