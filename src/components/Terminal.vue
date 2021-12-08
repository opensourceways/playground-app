<script>
export const RES_STATUS = {
  DONE: 1,
  CREATING: 0,
  CREATE_FAILED: 2,
  CONNECT_FAILED: 3,
  AUTH_FAILED: 4,
};
</script>

<script setup>
import "xterm/css/xterm.css";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  Xterm,
  WebTTY,
  protocols,
  ConnectionFactory,
} from "@/plugins/terminal";
import { createCrdResouse, queryCrdResouse } from "@/service/api";
import { getUserAuth, reLogin } from "@/shared/login";
// import GearLoading from "./LoadingGear.vue";
import LoadingRandom from "./LoadingRandom.vue";

const props = defineProps({
  dataset: {
    type: Object,
    default: null,
  },
});

const RETRY_TIMES = 2; // 重试次数
const RETRY_INTERVAL = 2; // 重试间隔(秒)
const DEF_TIMEOUT = 15; //资源创建超时时间(秒)
const DEF_INTERVAL = 3; // 创建中的资源轮询间隔(秒)
// 0: 创建中； 1：创建成功 2：创建失败； 3: 连接失败

function isResourceFailed(status) {
  return [
    RES_STATUS.CREATE_FAILED,
    RES_STATUS.CONNECT_FAILED,
    RES_STATUS.AUTH_FAILED,
  ].includes(status);
}

const resStatus = ref(RES_STATUS.CREATING);
function setResStatus(val) {
  resStatus.value = val;
}

let instance = null;
let terminal; // xterm实例
let terminalCloser = null; // websoket关闭函数
const loadingLabel = "正在为您准备环境，请耐心等待...";

const failedLabels = {
  [RES_STATUS.CREATE_FAILED]: {
    label: "资源创建失败，",
    btnLabel: "请重试",
    btnClick() {
      createResource(false);
    },
  },
  [RES_STATUS.CONNECT_FAILED]: {
    label: "资源连接失败，",
    btnLabel: "请重试",
    btnClick() {
      createResource(false);
    },
  },
  [RES_STATUS.AUTH_FAILED]: {
    label: "授权验证失败，",
    btnLabel: "请重新登录",
    btnClick() {
      reLogin();
    },
  },
};

let webTTYInstance;
const terminalEl = ref(null);
const emit = defineEmits(["resource-status"]);

function emitStatus(status) {
  const params =
    typeof status === "object"
      ? { ...status, id: props.dataset.id }
      : {
          status,
          id: props.dataset.id,
        };
  emit("resource-status", params);
}

/**
 * 轮询资源状态，直到返回成功或者失败
 */
function ensureResourceReady(resId) {
  const { token } = getUserAuth();
  const { resource } = props.dataset;

  const timeout = resource.timeout || DEF_TIMEOUT;
  const interval = resource.query_interval || DEF_INTERVAL;
  return new Promise((resolve) => {
    let cnt = 0;
    let handler;

    // 轮询状态
    const query = async function () {
      const res = await queryCrdResouse({
        userResId: resId,
        token,
      });
      if (res.code === 200) {
        const { instanceInfo } = res;
        if (instanceInfo.status === RES_STATUS.DONE) {
          console.log("资源创建成功，耗时", cnt + "s");
          clearInterval(handler);
          resolve(instanceInfo);
        } else if (instanceInfo.status === RES_STATUS.CREATE_FAILED) {
          clearInterval(handler);
          resolve(null);
        } else if (cnt >= timeout) {
          console.error("资源创建超时", timeout + "s");
          clearInterval(handler);
          resolve(null);
        }
      } else {
        console.error("资源创建失败", res.code, res.message);
        clearInterval(handler);
        resolve(null);
      }
    };

    handler = setInterval(async () => {
      cnt += interval;
      await query();
    }, interval * 1000);
  });
}

/**
 * 创建资源实例
 */
async function createInstance(isNew) {
  const { userId, token } = getUserAuth();
  if (!userId || !props.dataset) {
    return;
  }
  try {
    const { resource } = props.dataset;
    const res = await createCrdResouse({
      token,
      userId,
      contactEmail: resource.email,
      templatePath: resource.template,
      resourceId: resource.id,
      forceDelete: isNew ? 2 : 1,
    });
    if (res.code >= 200 && res.code < 400) {
      const { instanceInfo } = res;
      const { status } = instanceInfo;
      if (status === 0) {
        const info = await ensureResourceReady(instanceInfo.userResId);
        if (info) {
          return info;
        }
        throw new Error("创建失败");
      } else if (status === RES_STATUS.DONE) {
        return instanceInfo;
      } else {
        throw new Error("创建失败");
      }
    } else if (res.code === 403) {
      setResStatus(RES_STATUS.AUTH_FAILED);
    } else {
      throw new Error(res.code ? res.code + ", " + res.message : "");
    }
  } catch (error) {
    setResStatus(RES_STATUS.CREATE_FAILED);

    console.error("创建资源失败", error);
    return null;
  }
}

function openWebTTY() {
  terminalCloser && terminalCloser();
  terminalCloser = webTTYInstance.open();
  return terminalCloser;
}
function initConnection(term, instance) {
  let url = instance.endPoint;

  const gotty_auth_token = instance.authInfo;
  const args = window.location.search;

  console.log("建立连接", url);

  let reConnect = 0;
  const factory = new ConnectionFactory(url, protocols);
  let isConneted = false;
  webTTYInstance = new WebTTY(term, factory, args, gotty_auth_token, {
    onError() {
      if (reConnect < RETRY_TIMES) {
        reConnect++;
        setTimeout(() => {
          console.log(`第${reConnect}次尝试重新连接`);
          openWebTTY();
        }, RETRY_INTERVAL * 1000);
      } else {
        emitStatus(RES_STATUS.CONNECT_FAILED);
        setResStatus(RES_STATUS.CONNECT_FAILED);
      }
    },
    onReceive(data) {
      if (!isConneted) {
        console.log("资源连接成功", data);
        isConneted = true;
        setResStatus(RES_STATUS.DONE);
        emitStatus(instance);
      }
    },
    onClose() {
      if (isConneted && (reConnect === 0 || reConnect >= RETRY_TIMES)) {
        isConneted = false;
        terminal.output(
          "\x1B[0;33m \r\n=========================\r\nresource disconnected!\r\n"
        );
        console.log("资源及连接已销毁");

        // 禁止输入
        terminal.disableInput();
        emitStatus(RES_STATUS.CONNECT_FAILED);
      }
    },
  });
  openWebTTY();

  window.addEventListener("unload", () => {
    destroyTerminal();
  });
}

// 主动断连，需要上报断连事件，用于展示terminal状态
function disconnect() {
  emitStatus(RES_STATUS.CONNECT_FAILED);
  terminalCloser && terminalCloser();
}

// 销毁terminal 不需要上报断连事件
function destroyTerminal() {
  terminalCloser && terminalCloser();
  terminal && terminal.close();
}

async function createResource(isNew) {
  setResStatus(RES_STATUS.CREATING);

  emitStatus(RES_STATUS.CREATING);

  instance = await createInstance(isNew);
  if (!instance) {
    emitStatus(RES_STATUS.CREATE_FAILED);
    return;
  }

  terminal = new Xterm(terminalEl.value, {
    cursorStyle: "block",
    cursorBlink: true,
    theme: {
      background: "#141414",
      cursor: "#ff9933",
    },
  });
  initConnection(terminal, instance);
  focus();
}

// 适配尺寸
function fit() {
  if (terminal) {
    terminal.fitResize();
  }
}

// 输入命令
function enter(commmond) {
  if (webTTYInstance && commmond) {
    webTTYInstance.input(commmond.endsWith("\n") ? commmond : commmond + "\n");
  }
}

// 聚焦
function focus() {
  nextTick(() => {
    terminal.focus();
  });
}

onMounted(async () => {
  createResource(props.dataset.isNew);
});

onUnmounted(() => {
  destroyTerminal();
});

defineExpose({
  createResource,
  enter,
  fit,
  destroyTerminal,
  disconnect,
  focus,
});
</script>

<template>
  <div class="open-terminal">
    <div class="res-dlg-wrap" :class="{ hide: resStatus === 1 }">
      <div class="res-dlg">
        <div v-if="resStatus === RES_STATUS.CREATING" class="dlg-creating">
          <!-- <GearLoading class="icon-loading"></GearLoading> -->
          <loading-random class="icon-loading"></loading-random>
          <div class="label">{{ loadingLabel }}</div>
        </div>
        <div v-if="isResourceFailed(resStatus)" class="dlg-failed">
          <svg-icon name="alert-circle"></svg-icon>
          <span>{{ failedLabels[resStatus].label }}</span>
          <span class="link" @click="failedLabels[resStatus].btnClick">{{
            failedLabels[resStatus].btnLabel
          }}</span>
        </div>
      </div>
    </div>
    <div ref="terminalEl" class="terminal-el"></div>
  </div>
</template>

<style lang="scss">
.open-terminal {
  height: 100%;

  .terminal-el {
    width: 100%;
    height: calc(100% - 8px); // 底部预留位置，解决太靠底问题
    padding-left: 8px;
    position: relative;
    z-index: 0;
  }
  .res-dlg-wrap {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    display: flex;

    &.hide {
      display: none;
    }

    .title {
      font-size: 24px;
      color: #000;
      margin-bottom: 16px;
    }

    .actions {
      margin-top: 32px;
      display: flex;
      align-items: center;
    }
  }
  .res-dlg {
    color: #eee;
    font-size: 14px;
  }
  .link {
    color: #3a7fff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .icon-loading {
    font-size: 44px;
    color: #eee;
    .inner {
      background-color: #141414;
    }
    margin-right: 4px;
  }
  .dlg-creating {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1;
  }
  .dlg-failed {
    display: flex;
    align-items: center;
    .alert-circle {
      color: red;
      font-size: 24px;
      margin-right: 8px;
    }
  }
}
</style>
