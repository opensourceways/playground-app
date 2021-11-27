<script setup>
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
  <AppHeader class="app-header"></AppHeader>
  <div class="app-body">
    <router-view></router-view>
  </div>
  <div class="app-dialogs"></div>
</template>

<style lang="scss" scoped>
.app-header {
  height: 80px;
}
.app-body {
  height: calc(100vh - 80px);
}
.app-dialogs {
  position: relative;
  z-index: 100;
}
</style>
