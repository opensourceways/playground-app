import { request } from "@/plugins/axios";
import { getUserAuth } from "../shared/login";

// /**
//  * 获取授权的相关回调链接
//  * @returns
//  */
// export function queryAuthParams() {
//   const url = "/api/playground/oauth2/callback/links";
//   return request.get(url).then((res) => res.data);
// }

// /**
//  * 获取用户信息及码云token
//  * @returns
//  */
// export function queryAuthentication(params) {
//   const url = "/api/playground/oauth2/authentication";
//   return request.post(url, params).then((res) => res.data);
// }

/**
 * 获取用户信息
 * @returns
 */
export function queryUserInfo(params) {
  const url = "/api/playground/user/information";
  return request.get(url, { params }).then((res) => res.data);
}

/**
 * 创建crd资源
 * @returns
 */
export function createCrdResouse(params) {
  const url = "/api/playground/crd/resource";
  return request.post(url, params).then((res) => {
    return res.data;
  });
}

/**
 * 轮询资源状态
 * @returns
 */
export function queryCrdResouse(params) {
  const url = "/api/playground/crd/resource";
  return request.get(url, { params }).then((res) => {
    return res.data;
  });
}

/**
 * 获取应用Id
 * @returns
 */
export function queryAppId() {
  const url = "/api/playground/oauth2/callback/links";
  return request.get(url).then((res) => {
    return res.data;
  });
}

/**
 * 获取token及用户信息
 * @param {Object} params {id:'', federationIdentityId: ''}
 * @returns
 */
export function queryAuthentication(params) {
  const url = `/api/playground/oauth2/authentication`;
  return request.post(url, params).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户信息
 * @param {*} params
 * @returns
 */
export function queryUserTokenInfo(params) {
  const url = "/api/playground/oauth2/callback";
  return request.get(url, { params }).then((res) => {
    return res.data;
  });
}
/**
 * 获取idtoken
 * @param {*} params
 * @returns
 */
export function queryIDToken(params) {
  const url = "/api/playground/user/getIdToken";
  return request.get(url, { params }).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户学习进度
 * @returns
 */
export function queryCourseStatus() {
  const { token } = getUserAuth();
  const url = "/api/playground/users/course/chapter";
  return request
    .get(url, {
      params: {
        token,
      },
    })
    .then((res) => {
      return res.data;
    });
}

/**
 * 绑定用户学习进度
 * @param {*} params
 * @returns
 */
export function setCourseStatus(params) {
  const { token } = getUserAuth();
  const url = "/api/playground/users/course/chapter";
  return request.post(url, Object.assign({ token }, params)).then((res) => {
    return res.data;
  });
}
