<script setup>
import OButton from "@/components/OButton.vue";
import { computed } from "vue";

const emit = defineEmits(["item-click"]);

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

function click(item) {
  emit("item-click", item);
}
</script>

<template>
  <div class="open-article">
    <div class="body">
      <div v-for="item in articles" :key="item.value" class="section">
        <div v-if="item.type === 'buttons'" class="buttons">
          <o-button
            v-for="btn in item.value"
            :key="btn.label"
            :icon="btn.icon"
            :primary="btn.primary"
            :disabled="btn.disabled"
            @click="btn.click(btn)"
            >{{ btn.label }}</o-button
          >
        </div>
        <div v-else-if="item.type" :class="item.type">{{ item.value }}</div>
        <div v-else-if="Array.isArray(item)">
          <span
            v-for="sub in item"
            :key="sub.value"
            :class="sub.type"
            @click="click(sub)"
            >{{ sub.value }}</span
          >
        </div>
      </div>
    </div>
    <div class="foot">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.open-article {
  height: 100%;
  font-size: 16px;
  line-height: 24px;
  color: #333;
  text-align: justify;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .section {
    .title {
      font-size: 18px;
      color: #000;
      font-weight: 500;
    }
    + .section {
      margin-top: 24px;
    }
    .code {
      background-color: #dce6ff;
      padding-left: 4px;
      padding-right: 4px;
      cursor: pointer;
      margin: 0 4px;
      transition: background-color 0.3s;
      &:hover {
        background-color: #b4c9f1;
      }
    }
  }
  .o-button {
    min-width: 140px;
  }
  .body {
    overflow: auto;
    padding: 40px;
  }
  .foot {
    padding: 24px 40px 24px;
  }
}
</style>
