<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import mitt from "@/shared/mitt";
import { goAuthorize, LOGIN_EVENTS, logout } from "@/shared/login";
import { isLoggingIn } from "@/shared/login";
import { PLAYGROUND_KEYS } from "@/pages/playground/shared";

import ODialog from "./ODialog.vue";
import OButton from "./OButton.vue";
import LoadingDot from "./LoadingArc.vue";

import logoImg from "@/assets/moocstudio-logo.png";

const router = useRouter();

const userInfo = reactive({});

mitt.on(LOGIN_EVENTS.LOGINED, (data) => {
  userInfo.userId = data.userId;
  userInfo.name = data.nickName || data.email;
  userInfo.avatar = data.avatarUrl;
});

mitt.on(LOGIN_EVENTS.LOGOUT, () => {
  userInfo.userId = "";
  userInfo.name = "";
  userInfo.avatar = "";
});

const logoutLabel = "LOG OUT";
const loginLabel = "LOG IN";

const logoutLabels = {
  title: "提示",
  detail: "退出账号将结束进程并返回首页",
  btnLabels: ["取消操作", "继续退出"],
};

const showLogout = ref(false);

function toggleLogoutDlg(flag) {
  if (flag === undefined) {
    showLogout.value = !showLogout.value;
  } else {
    showLogout.value = flag;
  }
}

function doLogin() {
  goAuthorize();
}

function doLogout() {
  toggleLogoutDlg(false);
  logout();
  logoClick();
}

const avatarLoaded = ref(false);
function onAvatarLoad() {
  avatarLoaded.value = true;
}

function logoClick() {
  router.push({ name: "home" });
}
</script>

<template>
  <div class="header">
    <div class="header-logo" @click="logoClick">
      <img :src="logoImg" alt="" srcset="" />
    </div>
    <div class="header-tool">
      <loading-dot v-if="isLoggingIn" class="loading"></loading-dot>
      <div v-else class="user-info">
        <p v-if="!userInfo.userId" class="user-login" @click="doLogin">
          {{ loginLabel }}
        </p>

        <img
          v-if="userInfo.userId"
          class="user-avatar"
          :class="{ loaded: avatarLoaded }"
          :src="userInfo.avatar"
          @load="onAvatarLoad"
        />

        <div v-if="userInfo.userId" class="user-name">
          {{ userInfo.name }}
        </div>

        <div v-if="userInfo.userId" class="drop-menus">
          <div class="menu-item" @click="toggleLogoutDlg(true)">
            {{ logoutLabel }}
          </div>
        </div>
      </div>
    </div>

    <o-dialog :show="showLogout" @close-click="toggleLogoutDlg(false)">
      <template #head>
        <div class="dlg-title">{{ logoutLabels.title }}</div>
      </template>
      <div class="dlg-body">{{ logoutLabels.detail }}</div>
      <template #foot>
        <div class="dlg-actions">
          <o-button primary="" @click="toggleLogoutDlg(false)">{{
            logoutLabels.btnLabels[0]
          }}</o-button>

          <o-button style="margin-left: 12px" @click="doLogout">{{
            logoutLabels.btnLabels[1]
          }}</o-button>
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss">
.header {
  max-width: 1488px;
  margin: 0 auto;
  padding: 16px 36px;
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;

  @media screen and (max-width: 1023px) {
    padding: 16px 24px;
  }

  &-logo {
    display: flex;
    align-items: center;
    height: 34px;
    cursor: pointer;
    img {
      vertical-align: top;
      height: 100%;
    }
  }

  &-tool {
    height: 100%;
    display: flex;
    align-items: center;

    .loading {
      font-size: 24px;
      color: #002fa7;
    }

    .user-info {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;

      .user-login {
        padding: 12px;
        height: 48px;
        line-height: 24px;
        font-size: 20px;
        color: #5470ba;
        border: 1px solid #002fa7;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #002fa7;
        &.loaded {
          background: transparent;
        }
      }

      .user-name {
        margin-left: 8px;
        font-size: 16px;
        max-width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .drop-menus {
        display: none;
        position: absolute;
        right: 0;
        top: 30px;
        background-color: #fff;
        box-shadow: 1px 2px 8px rgba($color: #000000, $alpha: 0.1);
        padding: 8px 0;
        .menu-item {
          padding: 8px 24px;
          white-space: nowrap;
          cursor: pointer;
          min-width: 110px;
          &:hover {
            color: #002fa7;
          }
        }
      }

      &:hover {
        .drop-menus {
          display: block;
        }
      }
    }
  }
}

.dlg-title {
  height: 32px;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0;
  line-height: 32px;
  font-weight: 400;
}

.dlg-body {
  font-size: 14px;
  color: #555555;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
}
</style>
