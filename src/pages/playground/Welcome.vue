<script setup>
import AppArticle from "@/components/Article.vue";
import { beginToTry } from "./shared";
const contents = [
  {
    detail:
      "openEuler是一款开源操作系统。当前openEuler内核源于Linux，支持鲲鹏及其它多种处理器，能够充分释放计算芯片的潜能，是由全球开源贡献者构建的高效、稳定、安全的开源操作系统，适用于数据库、大数据、云计算、人工智能等应用场景。同时，openEuler是一个面向全球的操作系统开源社区，通过社区合作，打造创新平台，构建支持多处理器架构、统一和开放的操作系统，推动软硬件应用生态繁荣发展。",
  },
  {
    title: "openEuler Playground",
    detail:
      "openEuler Playground为社区开发者提供临时，原生的openEuler环境，方便开发者体验操作系统基础操作以及创新项目。",
  },
  {
    buttons: [
      {
        label: "START",
        icon: "o-icon-arrow-right",
        primary: true,
        click(btn) {
          console.log(btn);
          beginToTry();
        },
      },
    ],
  },
];
</script>

<template>
  <div class="terminal-app">
    <app-article :contents="contents"></app-article>
  </div>
</template>

<style lang="scss" scoped></style>
