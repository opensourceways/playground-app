<script setup>
import { reactive, ref } from "vue";
import { LOGIN_EVENTS, logout, goAuthorize } from "@/shared/login";
import mitt from "@/shared/mitt";
import ODialog from "./ODialog.vue";
import OButton from "./OButton.vue";
import LoadingDot from "./LoadingArc.vue";

import { doSignUp, isLoggingIn } from "@/shared/login";

let userInfo = reactive({});

mitt.on(LOGIN_EVENTS.LOGINED, (data) => {
  userInfo.userId = data.userId;
  userInfo.name = data.name || "--";
  userInfo.avatar = data.avatarUrl;
});
mitt.on(LOGIN_EVENTS.LOGOUT, () => {
  userInfo.userId = "";
  userInfo.name = "";
});

doSignUp();

const logoutLabel = "退出";
const loginLabel = "登录";

const logoutLabels = {
  title: "退出Gitee账号",
  detail: "退出Gitee账号",
  btnLabel: "注销登录",
};
const showLogout = ref(false);

function toggleLogoutDlg(flag) {
  if (flag === undefined) {
    showLogout.value = !showLogout.value;
  } else {
    showLogout.value = flag;
  }
}
function doLogout() {
  toggleLogoutDlg(false);
  logout();
}

const showLoginDlg = ref(false);
function toggleLoginDlg(show) {
  showLoginDlg.value = show;
}
const loginDlgSet = {
  title: "登录",
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
  privacyLink: "https://www.openeuler.org",
};

mitt.on(LOGIN_EVENTS.SHOW_LOGIN, () => {
  toggleLoginDlg(true);
});
</script>

<template>
  <div class="open-header">
    <div class="header-wrap">
      <div class="header-logo">
        <img src="@/assets/openeuler-logo.png" alt="" srcset="" />
      </div>
      <div class="header-tools">
        <div class="tool-item user">
          <loading-dot v-if="isLoggingIn" class="loading"></loading-dot>
          <div v-else class="user-info">
            <div v-if="!userInfo.userId" @click="toggleLoginDlg(true)">
              {{ loginLabel }}
            </div>
            <img
              v-if="userInfo.userId"
              class="user-avatar"
              :src="userInfo.avatar"
            />
            <div v-if="userInfo.userId" class="user-name">
              {{ userInfo.name }}
            </div>
          </div>

          <div v-if="userInfo.userId" class="drop-menus">
            <div class="menu-item" @click="toggleLogoutDlg(true)">
              {{ logoutLabel }}
            </div>
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
          <o-button :primary="true" @click="doLogout">{{
            logoutLabels.btnLabel
          }}</o-button>
        </div>
      </template>
    </o-dialog>
    <o-dialog
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
            <a
              :href="loginDlgSet.privacyLink"
              class="o-link"
              target="__blank"
              >{{ loginDlgSet.loginTip[1] }}</a
            >
          </div>
        </div>
      </template>
    </o-dialog>
  </div>
</template>

<style lang="scss">
.open-header {
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(178, 178, 178, 0.5);
}
.header-wrap {
  max-width: 1920px;
  margin: 0 auto;
  padding: 16px 36px;
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
}
.header-logo {
  height: 100%;
  display: flex;
  align-items: center;
  img {
    vertical-align: top;
    height: 100%;
  }
}
.header-tools {
  height: 100%;
  display: flex;
  align-items: center;
}
.tool-item {
  position: relative;
  height: 100%;
}
.user-info {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #002fa7;
    + .user-name {
      margin-left: 8px;
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
}

.drop-menus {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
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
.tool-item.user {
  display: flex;
  align-items: center;
  &:hover {
    .drop-menus {
      display: block;
    }
  }
  .loading {
    font-size: 24px;
    color: #002fa7;
  }
}

.dialog-login {
  .auth-tip {
    color: #c7cad0;
    font-size: 12px;
    margin-left: 24px;
  }
  .o-link {
    color: #002fa7;
    &:hover {
      color: #083fca;
      text-decoration: underline;
    }
  }
  .login-actions {
    display: flex;
    align-items: center;
  }
}
.time-tip {
  display: flex;
  align-items: flex-end;
}
.dialog-timeout {
  .login-actions {
    .o-button {
      margin-right: 24px;
    }
  }
}
</style>
