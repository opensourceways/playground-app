<script setup>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>

<template>
  <header class="app-header">
    <app-header></app-header>
  </header>

  <main class="app-body">
    <router-view></router-view>
  </main>
  <div class="app-dialogs"></div>

  <footer class="app-footer">
    <app-footer></app-footer>
  </footer>
</template>

<style lang="scss" scoped>
.app-header {
  height: 80px;
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(178, 178, 178, 0.5);
  @media screen and (max-width: 1023px) {
    height: 60px;
  }
}
.app-body {
  min-height: calc(100vh - 80px);
}
.app-dialogs {
  position: relative;
  z-index: 100;
}

.app-footer {
  background: #191a20;
}
</style>
