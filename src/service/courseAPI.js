import { request } from "@/plugins/axios";
import { handleMarkdown } from "@/shared/handle-markdown";

const prefix =
  "https://api.test.osinfra.cn/metadata/v1/metadata/infrastructure/playground-meta/courses";
// 拼接请求地址
function url(path) {
  return prefix + path;
}
// 处理返回的json字符串
function parseJson(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return {};
  }
}
// 处理请求错误
function onError(url) {
  console.error("Fail to request: ", url);
}

/**
 * 获取课程列表
 * @returns
 */
export function queryCourseList() {
  const path = url("/course-list.json");
  return request.get(path).then(parseJson).catch(onError(path));
}

/**
 * 获取课程信息
 * @returns
 */
export function queryCourseInfo(course) {
  const path = url(`/${course}/course-content.json`);
  return request.get(path).then(parseJson).catch(onError(path));
}

/**
 * 获取章节信息
 * @returns
 */
export function queryChapterInfo(course, chapter) {
  const path = url(`/${course}/${chapter}/index.json`);
  return request.get(path).then(parseJson).catch(onError(path));
}

/**
 * 获取步骤内容
 * @returns
 */
export function queryStepContent(course, chapter, step) {
  const path = url(`/${course}/${chapter}/${step}`);
  return request
    .get(path)
    .then((res) => handleMarkdown(res))
    .catch(onError(path));
}
