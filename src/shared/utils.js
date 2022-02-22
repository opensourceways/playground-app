import { ASSETS_PREFIX } from "@/config";

export function isTestEnv() {
  const { href } = window.location;
  return (
    href.startsWith("https://test.playground.osinfra.cn") ||
    href.startsWith("http://localhost:3000")
  );
}

export function resolveAsset(...paths) {
  let resolvePath = "";
  let isAbsolutePath = false;
  for (let i = paths.length - 1; i > -1; i--) {
    let path = paths[i];
    if (isAbsolutePath) {
      break;
    }
    if (!path) {
      continue;
    }
    resolvePath = path + "/" + resolvePath;
    isAbsolutePath = path.charCodeAt(0) === 47;
  }
  if (/^\/+$/.test(resolvePath)) {
    resolvePath = resolvePath.replace(/(\/+)/, "/");
  } else {
    resolvePath = resolvePath
      .replace(/(?!^)\w+\/+\.{2}\//g, "")
      .replace(/(?!^)\.\//g, "")
      .replace(/\/+$/, "");
  }
  return ASSETS_PREFIX + resolvePath;
}
