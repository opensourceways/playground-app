<script setup>
import "xterm/css/xterm.css";
import { ref, onMounted, onUnmounted } from "vue";
import {
  Xterm,
  WebTTY,
  protocols,
  ConnectionFactory,
} from "@/plugins/terminal";
import { createCrdResouse, queryCrdResouse } from "@/service/api";
import { getUserAuth } from "@/shared/login";
import GearLoading from "./LoadingGear.vue";

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["create-resource"]);

const terminalEl = ref(null);
// 0: 创建中； 1：创建成功 2：创建失败； 3: 连接失败
const resStatus = ref(0);
let instance = null;
let terminal; // xterm实例
let terminalCloser = null; // websoket关闭函数
const loadingLabel = "正在为您准备环境，请耐心等待...";
const failedLabel = "资源创建失败，";
const connectFailLabel = "资源连接失败，";
const retryLabel = "请重试";
const RESOURCE_CREATE_TIMEOUT = 15; //资源创建超时时间(秒)
const QUERY_INTERVAL = 3; // 创建中的资源轮询间隔(秒)
let webTTYInstance;
/**
 * 轮询资源状态，直到返回成功或者失败
 */
function ensureResourceReady(resId) {
  const { token } = getUserAuth();
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
        if (instanceInfo.status === 1) {
          clearInterval(handler);
          resolve(instanceInfo);
        } else if (instanceInfo.status === 2) {
          clearInterval(handler);
          resolve(null);
        }
      } else {
        clearInterval(handler);
        console.error("创建资源失败", res.code, res.message);
        resolve(null);
      }

      if (cnt >= RESOURCE_CREATE_TIMEOUT) {
        clearInterval(handler);
        console.error("创建资源超时", RESOURCE_CREATE_TIMEOUT + "s");
        resolve(null);
      }
    };

    handler = setInterval(async () => {
      await query();
      cnt += QUERY_INTERVAL;
      console.log(cnt);
    }, QUERY_INTERVAL * 1000);
  });
}

/**
 * 创建资源实例
 */
async function createInstance(isNew) {
  const { userId, token } = getUserAuth();
  if (!userId) {
    return;
  }
  try {
    const res = await createCrdResouse({
      token,
      userId,
      contactEmail: "contact@openeuler.io",
      templatePath: "openeuler-20.03-lts-sp1/container/x86.tmpl",
      // templatePath: "openeuler-20.03-lts-sp1/lxd/x86.tmpl",
      resourceId: "1",
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
      } else if (status === 1) {
        return instanceInfo;
      } else {
        throw new Error("创建失败");
      }
    }
    throw new Error(res.code + ", " + res.message);
  } catch (error) {
    resStatus.value = 2;

    console.error("创建资源失败", error);
    return null;
  }
}

function initConnection(term, instance) {
  let url = instance.endPoint;

  const gotty_auth_token = instance.authInfo;
  const args = window.location.search;

  console.log(url);
  const factory = new ConnectionFactory(url, protocols);
  let isConneted = false;
  webTTYInstance = new WebTTY(term, factory, args, gotty_auth_token, {
    onError() {
      console.log("ws onError");

      emit("create-resource", { status: 3 });
      resStatus.value = 3;
    },
    onReceive(data) {
      if (!isConneted) {
        console.log("[received]", data);
        isConneted = true;
        resStatus.value = 1;
        emit("create-resource", instance);
      } else {
        console.log("[received]", data && atob(data));
      }
    },
    onClose() {
      console.log("webtty closed");
      isConneted = false;
      closeConnection();
    },
  });
  terminalCloser = webTTYInstance.open();

  window.addEventListener("unload", () => {
    closeConnection();
  });
}

function closeConnection() {
  terminalCloser && terminalCloser();
  terminal && terminal.close();
}

async function createResource(isNew) {
  resStatus.value = 0;

  emit("create-resource", { status: 0 });

  instance = await createInstance(isNew);
  if (!instance) {
    emit("create-resource", { status: 2 });
    return;
  }

  terminal = new Xterm(terminalEl.value);
  initConnection(terminal, instance);
}

function fit() {
  if (terminal) {
    terminal.fitResize();
  }
}

function enter(commmond) {
  if (webTTYInstance && commmond) {
    webTTYInstance.input(commmond.endsWith("\n") ? commmond : commmond + "\n");
  }
}

onMounted(async () => {
  createResource(props.isNew);
});

onUnmounted(() => {
  closeConnection();
});

defineExpose({
  createResource,
  enter,
  fit,
});
</script>

<template>
  <div class="open-terminal">
    <div class="res-dlg-wrap" :class="{ hide: resStatus === 1 }">
      <div class="res-dlg">
        <div v-if="resStatus === 0" class="dlg-creating">
          <GearLoading class="icon-loading"></GearLoading>
          <div class="label">{{ loadingLabel }}</div>
        </div>
        <div v-show="resStatus >= 2" class="dlg-failed">
          <svg-icon name="alert-circle"></svg-icon>
          <span>{{ resStatus === 3 ? connectFailLabel : failedLabel }}</span>
          <span class="link" @click="createResource(false)">{{
            retryLabel
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
  background-color: black;

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
    font-size: 32px;
    color: #eee;
    .inner {
      background-color: black;
    }
  }
  .dlg-creating {
    display: flex;
    align-items: center;
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
