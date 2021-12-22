<script setup>
import TerminalGroup from "@/components/TerminalGroup.vue";
import OButton from "@/components/OButton.vue";
import ODialog from "@/components/ODialog.vue";
import { ref } from "vue";
import { PLAYGROUND_KEYS } from "./shared";
import { LOGIN_EVENTS } from "@/shared/login";
import mitt from "@/shared/mitt";
import { useRouter } from "vue-router";
import { beginToTry } from "./shared";
import { isLoggingIn } from "@/shared/login";
import RemainTime from "./RemainTime.vue";
import Courses from "@/configs/courses";

const router = useRouter();

const terminals = ref(null);
const isBegin = ref(false);
const showRemainTime = ref(false);

const courseData = Courses.experience;

function backToHome() {
  router.push({
    name: "welcome",
  });
  terminals.value.closeAllTerminal();
}

const startBtn = {
  label: "START",
  icon: "arrow-right",
  primary: true,
  click() {
    beginToTry();
  },
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
        toggleTimeoutDlg(false);

        isBegin.value = true;

        terminals.value.closeAllTerminal();

        startTry(true);
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
        isBegin.value = false;
        showRemainTime.value = false;

        backToHome();
      },
    },
  ],
};

const title = "体验openEuler";
const remainTimeIns = ref(null);

// 创建terminal，开始体验
function startTry(isNew) {
  terminals.value.addTerminal(isNew);
}

mitt.on(PLAYGROUND_KEYS.START, () => {
  isBegin.value = true;
  startTry();
});

// 注销登录时，应关闭所有连接
mitt.on(LOGIN_EVENTS.LOGOUT, () => {
  router.push({
    name: "welcome",
  });
  isBegin.value = false;
  showRemainTime.value = false;
  terminals.value.closeAllTerminal();
  remainTimeIns.value.reset();
});

mitt.on(PLAYGROUND_KEYS.ENTER, (data) => {
  terminals.value.enterCommond(data.commond);
});

function onTerminalLoaded(data) {
  if (data.isFirst) {
    router.push({
      name: "introduction",
    });
  }
  showRemainTime.value = true;
  remainTimeIns.value.updateTime(data.terminal.remainSecond);
}

function onTerminalDisconnect() {
  remainTimeIns.value.reset();
}

function onTimeout() {
  terminals.value.disconnectAllTerminal();
  toggleTimeoutDlg(true);
}
</script>

<template>
  <div class="playground-app">
    <div class="ground-head">
      <h3 class="title">{{ title }}</h3>
      <div v-show="showRemainTime" class="time-tip">
        <RemainTime ref="remainTimeIns" @timeout="onTimeout"></RemainTime>
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
                :primary="!isLoggingIn"
                :icon="startBtn.icon"
                :disabled="isLoggingIn"
                @click="startBtn.click"
                >{{ startBtn.label }}</o-button
              >
            </div>
          </div>
        </div>
        <TerminalGroup
          ref="terminals"
          :max="5"
          :resource="courseData.resource"
          @terminal-loaded="onTerminalLoaded"
          @terminal-disconnect="onTerminalDisconnect"
        ></TerminalGroup>
      </div>

      <ODialog
        class="dialog-timeout"
        :show="showTimeoutDlg"
        @close-click="toggleTimeoutDlg(false)"
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
  max-width: 1920px;
  margin: 0 auto;
  padding: 24px 36px;
  line-height: 32px;
  display: flex;
  justify-content: space-between;
}
.ground-body {
  height: calc(100% - 80px);
  display: flex;
  background: #fff;
}
.ground-article {
  width: 30%;
  min-width: 380px;
  height: 100%;
  flex-shrink: 0;
}
.ground-terminal {
  height: 100%;
  width: 70%;
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
    margin-bottom: 24px;
  }
  .bling {
    animation: bling 0.8s ease-in-out infinite;
  }
  .o-button {
    min-width: 140px;
  }
}
.terminal-mask-main {
  text-align: center;
}
</style>
