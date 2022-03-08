import { request } from "@/plugins/axios";

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

// /**
//  * 获取用户信息
//  * @returns
//  */
// export function queryUserInfo(params) {
//   const url = "/api/playground/user/information";
//   return request.get(url, { params }).then((res) => res.data);
// }

/**
 * 创建crd资源
 * @returns
 */
export function createCrdResouse(params) {
  const url = "/api/playground/crd/resource";
  return request.post(url, params).then((res) => res.data);
}

/**
 * 轮询资源状态
 * @returns
 */
export function queryCrdResouse(params) {
  const url = "/api/playground/crd/resource";
  return request.get(url, { params }).then((res) => res.data);
}

/**
 * 获取应用Id
 * @returns
 */
export function queryAppId() {
  const url = "/api/playground/oauth2/callback/links";
  return request.get(url).then((res) => res.data);
}

/**
 * 获取用户信息及authToken
 * @param {*} params
 * @returns
 */
export function queryAuthentication(params) {
  const url = `/api/playground/oauth2/callback?code=${params.code}`;
  return request.get(url).then((res) => {
    return res.data;
  });
}

/**
 * 获取用户信息
 * @param {*} params
 * @returns
 */
export function queryUserInfo(params) {
  const url = "/api/playground/oauth2/authentication";
  return request.post(url, params).then((res) => {
    return res.data;
  });
}
