<script setup>
import { ref } from "vue";
import mitt from "@/shared/mitt";

import { PLAYGROUND_PAGES } from "@/pages/playground/shared";
import { LOGIN_EVENTS } from "@/shared/login";

import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

import bg from "@/assets/bg/home-bg-nav.png";

const showFooter = ref(true);
const bodyBg = ref("#7721f4");
const clientSrc = ref("");

mitt.on(PLAYGROUND_PAGES.SET_FOOTER, (val) => {
  showFooter.value = val;
});

mitt.on(PLAYGROUND_PAGES.SET_BODY_BG, (val) => {
  bodyBg.value = val;
});
mitt.on(LOGIN_EVENTS.SHOW_LOGINED, (url) => {
  clientSrc.value = url;
});
</script>

<template>
  <div v-if="!clientSrc">
    <header class="app-header" :style="{ backgroundImage: `url(${bg})` }">
      <app-header></app-header>
    </header>

    <main class="app-body" :style="{ 'background-color': bodyBg }">
      <router-view></router-view>
    </main>
    <div class="app-dialogs"></div>

    <footer v-if="showFooter" class="app-footer">
      <app-footer></app-footer>
    </footer>
  </div>
  <iframe v-else :src="clientSrc" class="login-iframe" frameborder="0"></iframe>
</template>

<style lang="scss" scoped>
.login-iframe {
  width: 100%;
  height: 100vh;
}
.app-header {
  position: relative;
  z-index: 2;
  height: 80px;
  background-color: var(--gauss-color-primary);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.app-body {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 317px);
}

.app-dialogs {
  position: relative;
  z-index: 100;
}

.app-footer {
  background: var(--gauss-footer-color);
}
</style>
