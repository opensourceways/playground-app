<script setup>
import OButton from "@/components/OButton.vue";
import { computed } from "vue";
const props = defineProps({
  contents: {
    type: Array,
    default() {
      return [];
    },
  },
});

function normalize(texts) {
  return texts.map((item) => {
    if (typeof item === "string") {
      return {
        type: "label",
        value: item,
      };
    } else if (Array.isArray(item)) {
      return normalize(item);
    }
    return item;
  });
}

const articles = computed(() => {
  return normalize(props.contents);
});
console.log(articles.value);
</script>

<template>
  <div class="oe-article">
    <div v-for="item in articles" :key="item.value" class="section">
      <div v-if="item.type === 'buttons'" class="buttons">
        <o-button
          v-for="btn in item.value"
          :key="btn.label"
          :icon="btn.icon"
          :primary="btn.primary"
          @click="btn.click(btn)"
          >{{ btn.label }}</o-button
        >
      </div>
      <div v-else-if="item.type" :class="item.type">{{ item.value }}</div>
      <div v-else-if="Array.isArray(item)">
        <span v-for="sub in item" :key="sub.value" :class="sub.type">{{
          sub.value
        }}</span>
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
  }
  + .section {
    margin-top: 32px;
  }
  .code {
    background-color: #dce6ff;
    padding-left: 4px;
    padding-right: 4px;
    cursor: pointer;
    margin: 0 4px;
  }
}
.o-button {
  min-width: 140px;
}
</style>
