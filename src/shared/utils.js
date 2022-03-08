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

const numCN = {
  0: "零",
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
};

const unitCN = {
  0: "",
  1: "十",
  2: "百",
  3: "千",
  4: "万",
  5: "十",
  6: "百",
  7: "千",
  8: "亿",
  9: "十",
  10: "百",
  11: "千",
};

export function toNumCN(num) {
  const numArr = num.toString().split("").reverse();
  const res = [];
  for (let i = 0, len = numArr.length; i < len; i++) {
    res.push(numCN[parseInt(numArr[i])] + unitCN[i]);
  }
  return res.reverse().join("");
}
