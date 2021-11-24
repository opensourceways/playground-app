<script setup>
import "xterm/css/xterm.css";
import { ref, onMounted } from "vue";
import {
  Xterm,
  WebTTY,
  protocols,
  ConnectionFactory,
} from "@/plugins/terminal";
import { createCrdResouse, queryCrdResouse } from "@/service/api";
import { getUserAuth } from "@/shared/login";

// const props = defineProps({
//   instance: {
//     type: Object,
//     default() {
//       return null;
//     },
//   },
// });

const emit = defineEmits(["resource-created"]);

const terminalEl = ref(null);
// 0: 创建中； 1：创建成功 2：创建失败；
const resStatus = ref(0);
let instance = null;
let terminal;
const loadingLabel = "正在为您准备环境，请耐心等待...";
const failedLabel = "创建失败，";
const retryLabel = "请重试";
const RESOURCE_CREATE_TIMEOUT = 5; //资源创建超时时间 秒

function ensureResourceReady(resId) {
  const { token } = getUserAuth();
  return new Promise((resolve) => {
    let cnt = 0;
    const handler = setInterval(async () => {
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

      console.log(cnt);
      if (cnt >= RESOURCE_CREATE_TIMEOUT) {
        clearInterval(handler);
        resolve(null);
      }
      cnt += 1;
    }, 1000);
  });
}
async function createInstance() {
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
      resourceId: "1",
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
    throw new Error(res.code + res.message);
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
  const wt = new WebTTY(term, factory, args, gotty_auth_token);
  const closer = wt.open();

  window.addEventListener("unload", () => {
    closer();
    term.close();
  });
}

onMounted(async () => {
  createResource();
});

async function createResource() {
  instance = await createInstance();
  if (!instance) {
    return;
  }
  terminal = new Xterm(terminalEl.value);
  initConnection(terminal, instance);
  resStatus.value = 1;
  emit("resource-created", instance);
}

function fit() {
  if (terminal) {
    terminal.fitResize();
  }
}
function retry() {
  resStatus.value = 0;
  createResource();
}

defineExpose({
  fit,
});
</script>

<template>
  <div class="oe-terminal">
    <div class="res-dlg-wrap" :class="{ hide: resStatus === 1 }">
      <div class="res-dlg">
        <div v-if="resStatus === 0" class="dlg-creating">
          <div class="label">{{ loadingLabel }}</div>
        </div>
        <div v-show="resStatus === 2" class="dlg-failed">
          <span>{{ failedLabel }}</span>
          <span class="link" @click="retry">{{ retryLabel }}</span>
        </div>
      </div>
    </div>
    <div ref="terminalEl" class="terminal-el"></div>
  </div>
</template>

<style lang="scss">
.oe-terminal {
  height: 100%;
  background-color: black;

  .terminal-el {
    width: 100%;
    height: 100%;
    padding-left: 8px;
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
  }
  .res-dlg {
    background-color: #fff;
    padding: 32px 40px;
    min-width: 320px;
  }
  .link {
    color: #002fa7;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
