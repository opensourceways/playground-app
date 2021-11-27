<script setup>
import TerminalGroup from "@/components/TerminalGroup.vue";
import OButton from "@/components/OButton.vue";
import ODialog from "@/components/ODialog.vue";
import { ref } from "vue";
import { PLAYGROUND_KEYS } from "./shared";
import { goAuthorize, LOGIN_KEYS } from "@/shared/login";
import mitt from "@/shared/mitt";
import { useRouter } from "vue-router";
import { remainTime, TIME_KEYS } from "./remainTime";
import { beginToTry } from "./shared";

const router = useRouter();

const terminals = ref(null);
const isBegin = ref(false);

function backToHome() {
  router.push({
    name: "welcome",
  });
  terminals.value.closeAllTerminal();
}

const showLoginDlg = ref(false);
function toggleLoginDlg(show) {
  showLoginDlg.value = show;
}
const loginDlgSet = {
  title: "登录提示",
  content:
    "体验openEuler playground需要Gitee开发者身份权限，请您允许授权登录Gitee验证用户信息",
  button: {
    label: "Gitee授权登录",
    primary: true,
    click() {
      console.log("开始授权");
      toggleLoginDlg(false);
      goAuthorize();
    },
  },
  loginTip: ["登录即表示同意", "隐私条款"],
};

const showTimeoutDlg = ref(false);
function toggleTimeoutDlg(show) {
  showTimeoutDlg.value = show;
}
const timeoutDlgSet = {
  title: "体验时间到期！",
  content: "您本次的体验时间已到期，欢迎重新开始，继续体验。",
  buttons: [
    {
      id: 0,
      label: "重新开始",
      primary: true,
      click() {
        console.log("重新开始");
        toggleTimeoutDlg(false);

        isBegin.value = true;
        startTry();
      },
    },
    {
      id: 1,
      label: "返回首页",
      icon: "arrow-right",
      isText: true,
      click() {
        console.log("重新开始");
        toggleTimeoutDlg(false);
        backToHome;
      },
    },
  ],
};

const title = "体验openEuler";
const remainTimeLabel = "剩余体验时间：";

function startTry() {
  terminals.value.addTerminal();
}

mitt.on(PLAYGROUND_KEYS.STAERT, () => {
  isBegin.value = true;
  startTry();
});

mitt.on(LOGIN_KEYS.SHOW_LOGIN, () => {
  toggleLoginDlg(true);
});

mitt.on(LOGIN_KEYS.LOGOUT, () => {
  router.push({
    name: "welcome",
  });
  terminals.value.closeAllTerminal();
});

mitt.on(PLAYGROUND_KEYS.ENTER, (data) => {
  terminals.value.enterCommond(data.commond);
});

mitt.on(TIME_KEYS.TIMEOUT, () => {
  toggleTimeoutDlg(true);
});

function onFirstLoadTerminal() {
  router.push({
    name: "introduction",
  });
}

const startBtn = {
  label: "START",
  icon: "arrow-right",
  primary: true,
  click() {
    beginToTry();
  },
};
</script>

<template>
  <div class="playground-app">
    <div class="ground-head">
      <h3 class="title">{{ title }}</h3>
      <div class="time-tip">
        <div class="time-label">{{ remainTimeLabel }}</div>
        <div class="remain-time">
          <span class="time-item">{{ remainTime.hour }}</span
          >:<span class="time-item">{{ remainTime.minute }}</span
          >:<span class="time-item">{{ remainTime.second }}</span>
        </div>
      </div>
    </div>
    <div class="ground-body">
      <div class="ground-article">
        <router-view></router-view>
      </div>
      <div class="ground-terminal">
        <div v-if="!isBegin" class="terminal-mask">
          <div class="terminal-mask-main">
            <div class="text">
              <div>Welcome</div>
              <div>LET'S PLAY <span class="bling">_</span></div>
            </div>
            <div class="actions">
              <o-button
                :primary="true"
                :icon="startBtn.icon"
                @click="startBtn.click"
                >{{ startBtn.label }}</o-button
              >
            </div>
          </div>
        </div>
        <TerminalGroup
          ref="terminals"
          :max="5"
          @terminal-first-loaded="onFirstLoadTerminal"
        ></TerminalGroup>
      </div>
      <ODialog
        class="dialog-login"
        :show="showLoginDlg"
        @close-click="toggleLoginDlg(false)"
      >
        <template #head>
          <h3 class="title">{{ loginDlgSet.title }}</h3>
        </template>
        <div class="dlg-content">{{ loginDlgSet.content }}</div>
        <template #foot>
          <div class="login-actions">
            <o-button
              :primary="loginDlgSet.button.primary"
              @click="loginDlgSet.button.click(btn)"
              >{{ loginDlgSet.button.label }}</o-button
            >
            <div class="auth-tip">
              {{ loginDlgSet.loginTip[0] }}
              <a href="http://" class="o-link" target="__blank">{{
                loginDlgSet.loginTip[1]
              }}</a>
            </div>
          </div>
        </template>
      </ODialog>
      <ODialog
        class="dialog-timeout"
        :show="showTimeoutDlg"
        :close="false"
        @close-click="toggleLoginDlg(false)"
      >
        <template #head>
          <h3 class="title">{{ timeoutDlgSet.title }}</h3>
        </template>
        <div class="dlg-content">{{ timeoutDlgSet.content }}</div>
        <template #foot>
          <div class="login-actions">
            <o-button
              v-for="btn in timeoutDlgSet.buttons"
              :key="btn.id"
              :primary="btn.primary"
              :icon="btn.icon"
              :is-text="btn.isText"
              @click="btn.click(btn)"
              >{{ btn.label }}</o-button
            >
          </div>
        </template>
      </ODialog>
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
  max-width: 1440px;
  margin: 0 auto;
  padding: 25px 12px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
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
  z-index: 1;
  .text {
    font-size: 36px;
    line-height: 48px;
    text-align: center;
    font-family: monospace;
    margin-bottom: 24px;
  }
  .bling {
    animation: bling 0.8s ease-in-out infinite;
  }
}
.terminal-mask-main {
  text-align: center;
}
</style>
<style lang="scss">
.dialog-login {
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
  .login-actions {
    text-align: center;
  }
}
.time-tip {
  display: flex;
  align-items: flex-end;
}
.remain-time {
  font-size: 18px;
  color: #002fa7;
  display: flex;
  .time-item {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 32px;
    width: 32px;
    background-color: #fff;
    margin: 0 4px;
    box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);
  }
}
.dialog-timeout {
  .login-actions {
    .o-button {
      margin-right: 16px;
    }
  }
}
</style>
