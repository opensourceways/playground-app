<script setup>
import TerminalGroup from "@/components/TerminalGroup.vue";
import OButton from "@/components/OButton.vue";
import ODialog from "@/components/ODialog.vue";
import { ref, watch } from "vue";
import { isBegin } from "./shared";
import { isLogined, showLogin, goAuthorize, LOGIN_KEYS } from "@/shared/login";
import mitt from "@/shared/mitt";

const loginDialog = ref(null);

const title = "体验openEuler";

function startTry() {
  terminals.value.addTerminal();
}
const terminals = ref(null);

watch(isBegin, (val) => {
  console.log(val);
  if (!isLogined()) {
    showLogin();
  } else {
    startTry();
  }
});

mitt.on(LOGIN_KEYS.SHOW_LOGIN, () => {
  loginDialog.value.show();
});

const loginDlgSet = {
  title: "登录提示",
  content:
    "体验openEuler playground需要Gitee开发者身份权限，请您允许授权登录Gitee验证用户信息",
  button: {
    label: "Gitee授权登录",
    primary: true,
    click() {
      console.log("开始授权");
      goAuthorize();
    },
  },
  loginTip: ["登录即表示同意", "隐私条款"],
};
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
          <h3 class="title">{{ loginDlgSet.title }}</h3>
          <div class="dlg-content">{{ loginDlgSet.content }}</div>
          <div class="login-actions">
            <o-button
              :primary="loginDlgSet.button.primary"
              @click="loginDlgSet.button.click(btn)"
              >{{ loginDlgSet.button.label }}</o-button
            >
            <div class="auth-tip">
              {{ loginDlgSet.loginTip[0] }}
              <a href="http://" class="o-link">{{ loginDlgSet.loginTip[1] }}</a>
            </div>
          </div>
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
</style>
<style lang="scss">
.login-dialog {
  .dialog-head {
    display: none;
  }
  .title {
    text-align: center;
  }
  .dlg-content {
    margin-top: 24px;
    line-height: 32px;
  }
  .login-actions {
    text-align: center;
    margin-top: 24px;
  }

  .auth-tip {
    color: #c7cad0;
    font-size: 12px;
    margin-top: 8px;
  }
  .o-link {
    color: #002fa7;
    &:hover {
      color: #083fca;
      text-decoration: underline;
    }
  }
}
</style>
