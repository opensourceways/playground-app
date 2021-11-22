<script setup>
import AppHeader from "@/components/AppHeader.vue";
import { doSignUp } from "@/shared/login";
doSignUp();
</script>

<template>
  <AppHeader class="app-header"></AppHeader>
  <div class="app-body">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  height: 80px;
}
.app-body {
  height: calc(100vh - 80px);
}
</style>
