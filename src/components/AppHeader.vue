<script setup>
import { reactive } from "vue";
import { LOGIN_KEYS, logout } from "@/shared/login";
import mitt from "@/shared/mitt";

let userInfo = reactive({});

mitt.on(LOGIN_KEYS.LOGINED, (data) => {
  userInfo.userId = data.userId;
  userInfo.name = data.name;
});
mitt.on(LOGIN_KEYS.LOGOUT, (data) => {
  userInfo.userId = "";
  userInfo.name = "";
});

const logoutLabel = "退出";
function doLogout() {
  logout();
}
</script>

<template>
  <div class="oe-header">
    <div class="header-wrap">
      <div class="header-logo">
        <img src="@/assets/openeuler-logo.png" alt="" srcset="" />
        <span class="label">playground</span>
      </div>
      <div class="header-tools">
        <div v-if="userInfo.userId" class="tool-item user">
          <div class="user-info">{{ userInfo.name }}</div>
          <div class="drop-menus">
            <div class="menu-item" @click="logout">{{ logoutLabel }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.oe-header {
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(178, 178, 178, 0.5);
}
.header-wrap {
  // width: 1440px;
  margin: 0 auto;
  padding: 12px;
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
  .label {
    margin-left: 8px;
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
}
.drop-menus {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  box-shadow: 1px 2px 8px rgba($color: #000000, $alpha: 0.1);
  padding: 8px 0;
  .menu-item {
    padding: 8px 24px;
    white-space: nowrap;
    cursor: pointer;
    min-width: 100px;
    &:hover {
      color: #002fa7;
    }
  }
}
.tool-item.user {
  &:hover {
    .drop-menus {
      display: block;
    }
  }
}
</style>
