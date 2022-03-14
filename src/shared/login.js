import { ref, computed } from "vue";
import mitt from "@/shared/mitt";
import { queryAuthentication, queryUserInfo } from "@/service/api";
import { getAuthCode, setAuthCode } from "./login-code";
import { AuthingGuard, GuardMode } from "@authing/native-js-ui-components";
import { queryAppId } from "@/service/api";

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
  USER_ID: "_U_I_",
};

export let loginStatus = ref(LOGIN_STATUS.NOT);

function setStatus(val) {
  loginStatus.value = val;
}

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
let guard = null;

// 获取用户信息
export function getUserInfo() {
  if (isLogined.value) {
    return userInfo;
  } else {
    return null;
  }
}

// 注册
export async function doSignUp() {
  const code = getAuthCode();
  if (code) {
    try {
      setStatus(LOGIN_STATUS.DOING);

      const res = await queryAuthentication({
        token: code,
      });

      if (res.code === 200) {
        afterLogined(res.userInfo);
      } else {
        throw new Error(res.code + " " + res.message);
      }
    } catch (error) {
      setStatus(LOGIN_STATUS.FAILED);

      console.error("授权获取用户信息失败", error);
    }
  } else {
    requestUserInfo();
  }
}

// 存储用户id及token，用于下次登录
export function saveUserAuth(id, code) {
  if (!id && !code) {
    localStorage.removeItem(LOGIN_KEYS.USER_ID);
    localStorage.removeItem(LOGIN_KEYS.USER_TOKEN);
  } else {
    localStorage.setItem(LOGIN_KEYS.USER_ID, id);
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, code);
  }
}

// 获取用户id及token
export function getUserAuth() {
  let token = localStorage.getItem(LOGIN_KEYS.USER_TOKEN);
  let userId = localStorage.getItem(LOGIN_KEYS.USER_ID);
  if (token === "undefined" || userId === "undefined") {
    saveUserAuth();
    token = "";
    userId = -1;
  } else {
    userId = parseInt(userId);
  }
  return {
    userId,
    token,
  };
}

// 登录
export function showLogin() {
  mitt.emit(LOGIN_EVENTS.SHOW_LOGIN);
}

// 退出
export function logout() {
  setStatus(LOGIN_STATUS.NOT);
  userInfo = null;
  saveUserAuth();
  mitt.emit(LOGIN_EVENTS.LOGOUT);
}

// 请求用户信息
export async function requestUserInfo() {
  const { userId, token } = getUserAuth();
  if (userId && token) {
    try {
      setStatus(LOGIN_STATUS.DOING);

      const res = await queryUserInfo({
        token,
        userId,
      });

      if (res.code === 200 && res.userInfo.userId) {
        afterLogined(res.userInfo);
      } else {
        throw new Error(res.code + " " + res.message);
      }
    } catch (err) {
      setStatus(LOGIN_STATUS.FAILED);
      saveUserAuth();
      console.error("获取用户信息失败", err);
    }
  }
}

function afterLogined(userInfo) {
  if (!userInfo || !userInfo.userId) {
    return;
  }
  saveUserAuth(userInfo.userId, userInfo.userToken);

  setStatus(LOGIN_STATUS.DONE);

  mitt.emit(LOGIN_EVENTS.LOGINED, userInfo);
}

export function reLogin() {
  logout();
  showLogin();
}

export async function initGuard() {
  if (!guard) {
    try {
      const res = await queryAppId();
      if (res.code === 200) {
        guard = new AuthingGuard(res.callbackInfo.appId, {
          title: "openEuler",
          mode: GuardMode.Modal,
          clickCloseable: true,
          escCloseable: true,
        });
        guard.on("login", (authClient) => {
          console.log("authClient:", authClient);
          if (authClient.token) {
            setAuthCode(authClient.token);
            doSignUp();
            setTimeout(() => {
              guard.hide();
            }, 800);
          }
        });
      } else {
        console.error("获取登录信息失败！");
      }
    } catch (error) {
      console.error("获取登录信息失败！");
    }
  }
  return guard;
}

export async function goAuthorize() {
  const guard = await initGuard();
  if (guard) {
    guard.show();
  }
}

export function removeGuard() {
  guard = null;
}
