import { REQUEST_PREFIX } from "@/config";
import { request } from "@/plugins/axios";
import { handleMarkdown } from "@/shared/handle-markdown";
import { resolveAsset as R } from "@/shared/utils";

// 拼接请求地址
function url(path) {
  return REQUEST_PREFIX + path;
}

// 处理请求错误
function onError(e, url) {
  console.error("Fail to request: ", url, e);
}

/**
 * 获取课程列表
 * @returns
 */
export function queryCourseList() {
  const path = url("/course-list.json");
  return request
    .get(path)
    .then((res) => res.data)
    .catch((e) => onError(e, path));
}

/**
 * 获取课程信息
 * @param {*} coursePath 课程文件
 * @returns
 */
export function queryCourseInfo(coursePath) {
  const prefix = `/${coursePath}`;
  const path = url(`${prefix}/course-content.json`);
  return request
    .get(path)
    .then((res) => {
      const { data } = res;
      data._prefix = prefix;
      // 处理资源路径
      data.logo = R(prefix, data.logo);
      data.cover = R(prefix, data.cover);
      data.poster = R(prefix, data.poster);
      return data;
    })
    .catch((e) => onError(e, path));
}

/**
 * 获取课程列表及每个课程的详情信息
 * @param {*} status 状态 test/online
 * @returns
 */
export function queryCourseListInfo(status) {
  return queryCourseList().then((data) => {
    if (Array.isArray(data.courses)) {
      const courses = status
        ? data.courses.filter((item) => {
            return item.status.includes(status);
          })
        : data.courses;

      return Promise.all(
        courses.map((item) => {
          return queryCourseInfo(item.content_dir);
        })
      ).then((result) => {
        return result.map((item, idx) => {
          return {
            ...item,
            _course: courses[idx],
          };
        });
      });
    }
  });
}

/**
 * 获取章节信息
 * @param {*} coursePath 课程文件
 * @param {*} chapterPath 章节文件
 * @returns
 */
export function queryChapterInfo(coursePath, chapterPath) {
  const prefix = `/${coursePath}/${chapterPath}`;
  const path = url(`${prefix}/index.json`);
  return request
    .get(path)
    .then((res) => {
      return {
        ...res.data,
        _prefix: prefix,
        _course: coursePath,
        _chapter: chapterPath,
      };
    })
    .catch((e) => onError(e, path));
}

/**
 * 获取步骤内容
 * @param {*} coursePath 课程文件
 * @param {*} chapterPath 章节文件
 * @param {*} stepPath 步骤文件
 * @returns
 */
export function queryStepContent(coursePath, chapterPath, stepPath) {
  const prefix = `/${coursePath}/${chapterPath}/${stepPath}`;

  const path = url(prefix);
  return request
    .get(path)
    .then((res) => {
      const html = handleMarkdown(res.data);
      return {
        html: html,
        _prefix: prefix,
        _course: coursePath,
        _chapter: chapterPath,
        _step: stepPath,
      };
    })
    .catch((e) => onError(e, path));
}

/**
 * 获取章节及步骤的文本内容
 * @param {*} coursePath 课程文件
 * @param {*} chapterPath 章节文件
 * @returns
 */
export function queryChapterDetail(coursePath, chapterPath) {
  return queryChapterInfo(coursePath, chapterPath).then((data) => {
    const { details } = data;

    const all = [
      Promise.all(
        details.steps.map((item) =>
          queryStepContent(coursePath, chapterPath, item.md_file)
        )
      ),
      queryStepContent(coursePath, chapterPath, details.introduction.md_file),
      queryStepContent(coursePath, chapterPath, details.finish.md_file),
    ];

    return Promise.all(all).then((rlt) => {
      details.steps = rlt[0].map((item, idx) => {
        return {
          ...item,
          ...details.steps[idx],
        };
      });

      details.introduction = {
        ...details.introduction,
        ...rlt[1],
      };
      details.finish = {
        ...details.finish,
        ...rlt[2],
      };

      return data;
    });
  });
}
