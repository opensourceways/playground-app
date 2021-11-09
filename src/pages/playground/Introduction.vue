<script setup>
import AppArticle from "@/components/Article.vue";
const contents = [
  "openEuler支持 yum 及 dnf 等RPM包管理工具对软件包进行管理，下面通过安装一个简单的示例展示如何在openEuler上安装软件包。",
  [
    "1.执行：",
    { value: "sudo yum -y update", type: "code" },
    "或",
    { value: "sudo dnf -y update", type: "code" },
    "对软件包源进行更新",
  ],
  [
    "2.执行：",
    { value: "sudo yum -y install nginx", type: "code" },
    "或",
    { value: "sudo dnf -y install nginx", type: "code" },
    "安装 nginx",
  ],
  [
    "3.执行：",
    { value: "sudo nginx > /dev/null 2>&1 &", type: "code" },
    "以后台方式启动niginx",
  ],
  ["4.执行：", { value: "curl 127.0.0.1:80", type: "code" }, "访问nginx页面"],
];
</script>

<template>
  <div class="terminal-app">
    <app-article :contents="contents"></app-article>
  </div>
</template>

<style lang="scss" scoped></style>
