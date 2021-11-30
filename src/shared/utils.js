export function getEnv() {
  return "test";
}

export function isTextEnv() {
  const { href } = window.location.href;
  return (
    href.startsWith("https://test.playground.osinfra.cn") ||
    href.startsWith("http://localhost:3000")
  );
}
