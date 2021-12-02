<script setup>
import AppArticle from "@/components/Article.vue";
import { enterCommond } from "./shared";
import WarmTips from "./WarmTips.vue";
import content from "@/courses/experience/Introduction";

function itemClick(item) {
  if (item.type === "code" && item.commond) {
    enterCommond(item.commond);
  }
}
</script>

<template>
  <app-article :content="content" @item-click="itemClick">
    <template #foot><warm-tips></warm-tips></template>
  </app-article>
</template>

<style lang="scss" scoped></style>
