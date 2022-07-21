import { ref, computed } from "vue";

import mitt from "@/shared/mitt";
import { AuthenticationClient } from "authing-js-sdk";
import { queryAppId, queryUserInfo } from "@/service/api";

export const LOGIN_EVENTS = {
  SHOW_LOGIN: "show-login",
  LOGOUT: "do-logout",
  LOGINED: "logined",
};

// -1: 登录失败；0：未登录；1：登录中；2：登录成功
export const LOGIN_STATUS = {
  FAILED: -1,
  NOT: 0,
  DOING: 1,
  DONE: 2,
};

const LOGIN_KEYS = {
  USER_TOKEN: "_U_T_",
  USER_INFO: "_U_I_",
};

export let loginStatus = ref(LOGIN_STATUS.NOT);

function setStatus(val) {
  loginStatus.value = val;
}

// 是否未登录
export const isLoginNot = computed(() => {
  return loginStatus.value === LOGIN_STATUS.NOT;
});

// 是否登录中
export const isLoggingIn = computed(() => {
  return loginStatus.value === LOGIN_STATUS.DOING;
});

// 是否登录
export const isLogined = computed(() => {
  return loginStatus.value === LOGIN_STATUS.DONE;
});

// 是否登录失败
export const isLoginFailed = computed(() => {
  return loginStatus.value === LOGIN_STATUS.FAILED;
});

let userInfo = null;

// 获取用户信息
export function getUserInfo() {
  if (isLogined.value) {
    return userInfo;
  } else {
    return null;
  }
}
export function getCodeByUrl() {
  const query = getUrlParam();
  if (query.code && query.state) {
    const param = {
      code: query.code,
      state: query.state,
    };
    queryUserInfo(param).then((res) => {
      const {
        token = "",
        idtoken = "",
        user: { picture = "", nickname = "", sub = "" },
      } = res;
      saveUserAuth(token, { picture, nickname, sub, idtoken });
      mitt.emit(LOGIN_EVENTS.LOGINED, { picture, nickname, sub });
      // 去掉url中的code
      let newUrl = location.origin + "/#/home";
      if (window.history.replaceState) {
        window.history.replaceState({}, "", newUrl);
      } else {
        window.location.href = newUrl;
      }
    });
  }
}

function getUrlParam(url = window.location.search) {
  const param = {};
  const arr = url.split("?");
  if (arr[1]) {
    const _arr = arr[1].split("&") || [];
    _arr.forEach((item) => {
      const it = item.split("=");
      if (it.length === 2) {
        param[it[0]] = it[1];
      }
    });
  }
  return param;
}

// 存储用户id及token，用于下次登录
export function saveUserAuth(code, info) {
  if (!info && !code) {
    localStorage.removeItem(LOGIN_KEYS.USER_INFO);
    localStorage.removeItem(LOGIN_KEYS.USER_TOKEN);
  } else {
    localStorage.setItem(LOGIN_KEYS.USER_INFO, JSON.stringify(info));
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, code);
  }
}

// 获取用户id及token
export function getUserAuth() {
  let token = localStorage.getItem(LOGIN_KEYS.USER_TOKEN) || "";
  let userInfo = localStorage.getItem(LOGIN_KEYS.USER_INFO);
  let userId = -1;
  if (token === "undefined" || userInfo === "undefined") {
    saveUserAuth();
    token = "";
    userInfo = {};
    userId = -1;
  } else {
    try {
      userInfo = JSON.parse(userInfo) || {};
    } catch {
      userInfo = {};
    }
    userId = userInfo.sub || -1;
  }
  return {
    userId,
    token,
    userInfo,
  };
}

// 登录
export function showLogin() {
  mitt.emit(LOGIN_EVENTS.SHOW_LOGIN);
}
const redirectUri = `${location.origin}/`;
// 退出
export function logout() {
  queryAppId().then((res) => {
    if (res.code === 200) {
      const client1 = createClient(
        res.callbackInfo.appId,
        res.callbackInfo.appHost
      );
      const { userInfo } = getUserAuth();
      let logoutUrl = client1.buildLogoutUrl({
        protocol: "oidc",
        expert: true,
        redirectUri,
        idToken: userInfo.idtoken,
      });
      setStatus(LOGIN_STATUS.NOT);
      saveUserAuth();
      mitt.emit(LOGIN_EVENTS.LOGOUT);
      location.href = logoutUrl;
    }
  });
}
function createClient(appId, appHost) {
  return new AuthenticationClient({
    appId,
    appHost,
    redirectUri,
  });
}

export function reLogin() {
  logout();
  showLogin();
}

export async function goAuthorize() {
  queryAppId().then((res) => {
    if (res.code === 200) {
      const client = createClient(
        res.callbackInfo.appId,
        res.callbackInfo.appHost
      );
      // 构造 OIDC 授权登录 URL
      let url = client.buildAuthorizeUrl();
      // 如果需要获取 Refresh token，请在 scope 中加入 offline_access 项
      let url2 = client.buildAuthorizeUrl({
        scope: "openid profile offline_access",
      });
      location.href = url;
      url2;
    }
  });
}
