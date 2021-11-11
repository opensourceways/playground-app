<script setup>
import TerminalGroup from "@/components/TerminalGroup.vue";
import ODialog from "@/components/ODialog.vue";
import { ref, watch } from "vue";
import { isBegin } from "./shared";
import { queryLinks } from "@/service/api";

const loginDialog = ref(null);

const title = "体验openEuler";

function startTry() {
  terminals.value.addTerminal();
}
const terminals = ref(null);

watch(isBegin, (val) => {
  console.log(val);
  startTry();
  // loginDialog.value.show();
});

const loginDlgSet = {
  title: "登录提示",
  content:
    "体验openEuler playground需要Gitee开发者身份权限，请您允许授权登录Gitee验证用户信息",
};

queryLinks().then((res) => {
  console.log(res);
});
</script>

<template>
  <div class="playground-app">
    <div class="ground-head">
      <h3 class="title">{{ title }}</h3>
    </div>
    <div class="ground-body">
      <div class="ground-article">
        <router-view></router-view>
      </div>
      <div class="ground-terminal">
        <div v-if="!isBegin" class="terminal-mask">
          <div class="text">
            <div>Welcome</div>
            <div>LET'S PLAY <span class="bling">_</span></div>
          </div>
        </div>
        <TerminalGroup ref="terminals" :max="5"></TerminalGroup>
      </div>
      <Teleport to="body">
        <ODialog ref="loginDialog" class="login-dialog">
          <template #head>
            <h3>{{ loginDlgSet.title }}</h3>
          </template>
          <div class="dlg-content">{{ loginDlgSet.content }}</div>
        </ODialog>
      </Teleport>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes bling {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.playground-app {
  height: 100%;
  background: #f5f7fb;
}
.ground-head {
  width: 1440px;
  margin: 0 auto;
  padding: 25px 12px;
  line-height: 30px;
}
.ground-body {
  height: calc(100% - 80px);
  display: flex;
  background: #fff;
}
.ground-article {
  width: 382px;
  overflow: auto;
  height: 100%;
  flex-shrink: 0;
}
.ground-terminal {
  height: 100%;
  width: calc(100% - 382px);
  background: #141414;
  position: relative;
}

.terminal-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    font-size: 36px;
    line-height: 48px;
    text-align: center;
    font-family: monospace;
  }
  .bling {
    animation: bling 0.8s ease-in-out infinite;
  }
}

.login-dialog {
  .dlg-content {
    line-height: 36px;
  }
}
</style>
