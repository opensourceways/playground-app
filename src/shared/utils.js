export function getEnv() {
  return "test";
}

export function isTextEnv() {
  const { href } = window.location;
  return (
    href.startsWith("https://test.playground.osinfra.cn") ||
    href.startsWith("http://localhost:3000")
  );
}

export function getRedirectUri() {
  return isTextEnv()
    ? "https://test.playground.osinfra.cn/playground/test-login.html?redicrec=" +
        encodeURIComponent(window.location.href)
    : window.location.href;
}
