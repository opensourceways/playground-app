<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import mitt from "@/shared/mitt";

import { goAuthorize, LOGIN_EVENTS, logout } from "@/shared/login";
import { isLoggingIn } from "@/shared/login";
import { PLAYGROUND_PAGES } from "@/pages/playground/shared";

import ODialog from "./ODialog.vue";
import OButton from "./OButton.vue";
import LoadingArc from "./LoadingArc.vue";

import logoImg from "@/assets/logo/moocstudio-logo.png";

const router = useRouter();

const userInfo = reactive({});

const logoutLabel = "退出登录";
const loginLabel = "LOG IN";

const logoutLabels = {
  title: "提示",
  detail: "退出账号将结束进程并返回首页",
  btnLabels: ["取消操作", "继续退出"],
};

const showLogout = ref(false);
const avatarLoaded = ref(false);

function toggleLogoutDlg(flag) {
  if (flag === undefined) {
    showLogout.value = !showLogout.value;
  } else {
    showLogout.value = flag;
  }
}

function doLogin() {
  mitt.emit(LOGIN_EVENTS.SHOW_LOGIN);
}

function doLogout() {
  toggleLogoutDlg(false);
  logout();
  handleLogoClick();
}

function onAvatarLoad() {
  avatarLoaded.value = true;
}

function handleLogoClick() {
  mitt.emit(PLAYGROUND_PAGES.BACK_TO_HOME);
}

mitt.on(LOGIN_EVENTS.SHOW_LOGIN, () => {
  goAuthorize();
});

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

mitt.on(PLAYGROUND_PAGES.BACK_TO_HOME, () => {
  router.push({ name: "home" });
});
</script>

<template>
  <div class="header">
    <div class="header-logo" @click="handleLogoClick">
      <img :src="logoImg" alt="" srcset="" />
    </div>
    <div class="header-tool">
      <loading-arc v-if="isLoggingIn" class="loading"></loading-arc>
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
          <o-button
            primary
            :style="{ marginRight: '24px' }"
            @click="toggleLogoutDlg(false)"
            >{{ logoutLabels.btnLabels[0] }}</o-button
          >

          <o-button icon="arrow-right" is-text @click="doLogout">{{
            logoutLabels.btnLabels[1]
          }}</o-button>
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1488px;
  margin: 0 auto;
  height: 100%;
  padding: 16px 36px;

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
      font-size: 18px;
      color: #ffffff;
      background-color: var(--euler-color-primary);
    }

    .user-info {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      color: var(--euler-text-color-light);
      cursor: pointer;

      .user-login {
        padding: 8px 16px;
        height: 34px;
        font-size: 18px;
        font-weight: normal;
        line-height: 18px;
        color: var(--euler-text-color-light);
        border: 1px solid var(--euler-color-white);
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--euler-color-primary);
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
        top: 100%;
        border: 1px solid var(--euler-color-primary);

        .menu-item {
          min-width: 120px;
          height: 48px;
          padding: 0 32px;
          font-size: 14px;
          font-weight: normal;
          line-height: 48px;
          background-color: var(--euler-text-color-light);
          color: var(--euler-text-color-dark);
          white-space: nowrap;
          transition: color 0.2s, background-color 0.3s;
          cursor: pointer;

          &:hover {
            color: var(--euler-color-primary);
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
  color: var(--euler-text-color-dark);
  letter-spacing: 0;
  line-height: 32px;
  font-weight: bold;
}

.dlg-body {
  font-size: 14px;
  color: var(--euler-color-gray-2);
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
}
</style>
