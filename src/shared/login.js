import { ref } from "vue";
import mitt from "@/shared/mitt";
import {
  queryAuthParams,
  queryAuthentication,
  queryUserInfo,
} from "@/service/api";

export const LOGIN_KEYS = {
  SHOW_LOGIN: "show-login",
  USER_TOKEN: "_U_T_",
  USER_ID: "_U_I_",
  LOGOUT: "do-logout",
  LOGINED: "logined",
};

let logined = false;
let userInfo = null;
// 是否登录
export function isLogined() {
  return logined;
}
// 获取用户信息
export function getUserInfo() {
  if (logined) {
    return userInfo;
  } else {
    return null;
  }
}

// 登录
export function showLogin() {
  mitt.emit(LOGIN_KEYS.SHOW_LOGIN);
}

// 注册
export async function doSignUp() {
  const code = getCodeByUrl();
  if (code) {
    try {
      const res = await queryAuthentication({
        code,
      });
      afterLogined(res.userInfo);
    } catch (error) {
      console.error("授权获取用户信息失败", error);
    }
  } else {
    requestUserInfo();
  }
}
// 去码云授权
export async function goAuthorize() {
  try {
    const data = await queryAuthParams();
    if (!data.callbackInfo) {
      return;
    }
    const { callbackUrl, clientId } = data.callbackInfo;
    const url = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code`;
    console.log(url);
    // window.location.href = url;
  } catch (error) {
    console.error("获取认证参数失败");
  }
}
// 获取授权码
function getCodeByUrl(url = window.location.href) {
  let code = "";
  const mt = url.match(/code=([^&=]+)/);
  if (mt && mt[1]) {
    code = mt[1];
    // 去掉url中的code
    let newUrl = url.replace(/(\?|&)?code=[^&=]+/g, "");
    console.log(newUrl);
    window.history.replaceState(
      {
        path: newUrl,
      },
      "",
      newUrl
    );
  }
  return code;
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
  return {
    userId: localStorage.getItem(LOGIN_KEYS.USER_ID),
    userToken: localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
  };
}
// 退出
export function logout() {
  saveUserAuth();
  mitt.emit(LOGIN_KEYS.LOGOUT);
}
// 请求用户信息
export async function requestUserInfo() {
  const { userId, userToken } = getUserAuth();
  if (userId && userToken) {
    const res = await queryUserInfo({
      token: userToken,
      userId: userId,
    });

    afterLogined(res.userInfo);
  }
}

function afterLogined(userInfo) {
  if (!userInfo) {
    return;
  }
  console.log(userInfo);
  saveUserAuth(userInfo.userId, userInfo.userToken);

  logined = true;

  mitt.emit(LOGIN_KEYS.LOGINED, userInfo);
}
