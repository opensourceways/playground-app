import { get, post } from "@/plugins/axios";

/**
 * 获取回调链接
 * @returns
 */
export function queryLinks() {
  const url = "/plauground/oauth2/callback/links";
  return get(url);
}

/**
 * 码云授权回调
 * @returns
 */
export function queryGiteeAuth() {
  const url = "/plauground/oauth2/callback";
  return get(url);
}

/**
 * 获取用户信息及码云token
 * @returns
 */
export function queryAuthentication(params) {
  const url = "/plauground/oauth2/authentication";
  return post(url, params);
}

/**
 * 获取用户信息
 * @returns
 */
export function queryUserInfo() {
  const url = "/plauground/oauth2/callback";
  return get(url);
}

/**
 * 创建crd资源
 * @returns
 */
export function createCrdResouse(params) {
  const url = "/plauground/crd/resource";
  return post(url, params);
}

/**
 * 轮询资源状态
 * @returns
 */
export function queryCrdResouse() {
  const url = "/plauground/crd/resource";
  return get(url);
}
