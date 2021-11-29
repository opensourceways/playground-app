let authCode = "";
/**
 * 从url中获取code，用于获取AT
 * 该函数必须在项目入口最前面引入，否则或出现code清除不成功
 * @returns code
 */
export function getCodeByUrl(url = window.location.href) {
  const mt = url.match(/code=([^&=]+)/);
  if (mt && mt[1]) {
    authCode = mt[1];
    // 去掉url中的code
    let newUrl = url.replace(/(\?|&)?code=[^&=]+/g, "");

    if (window.history.replaceState) {
      window.history.replaceState({}, "", newUrl);
    } else {
      window.location.href = newUrl;
    }
  }
  return authCode;
}

export function getAuthCode() {
  return authCode;
}

// 获取code
getCodeByUrl();
