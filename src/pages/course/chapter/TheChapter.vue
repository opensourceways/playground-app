<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

import Courses from "@/configs/courses";
import mitt from "@/shared/mitt";
import { courseList } from "@/shared/composition/course";
import { queryChapterDetail } from "@/service/courseAPI";
import { PLAYGROUND_KEYS } from "@/pages/playground/shared";
import { toNumCN } from "@/shared/utils";
import { isLoggingIn, isLogined } from "@/shared/login";

import ODialog from "@/components/ODialog.vue";
import OButton from "@/components/OButton.vue";
import ODropdown from "@/components/ODropdown.vue";
import ODropDownItem from "@/components/ODropdownItem.vue";
import TerminalMask from "@/components/TerminalMask.vue";
import CourseArticle from "@/components/CourseArticle.vue";
import ChapterStep from "@/pages/course/chapter/ChapterStep.vue";
import TerminalGroup from "@/components/TerminalGroup.vue";
import { setCourseStatus } from "@/service/api";

const courseData = Courses.experience;

const route = useRoute();
const router = useRouter();

const coursePath = ref(route.params.coursePath);
const chapterPath = ref(route.params.chapterPath);

const terminals = ref(null);
const scroller = ref(null);

const introduction = ref({});
const stepList = ref([]);
const finish = ref({});

// 开始按钮文字
const startBtnLabel = "START";
// 结束按钮文字
const finishBtnLabel = "FINISH";

// 结束对话框文字
const finishDlgLabels = {
  title: "课程完成！",
  info: "恭喜你完成本门课程，进一寸有进一寸的欢喜",
  nextBtn: "下一章节",
  restartBtn: "重新开始",
};

// 用户未登录，需返回首页
const needsBack = computed(() => {
  if (!isLoggingIn.value && !isLogined.value) {
    return true;
  }
  return false;
});

watch(
  () => {
    return needsBack.value;
  },
  (val) => {
    if (val) {
      router.push({ name: "home" });
    }
  },
  { immediate: true }
);

// 当前课程
const courseInfo = computed(() => {
  const rlt = courseList.value.find((item) => {
    return item._course.content_dir === coursePath.value;
  });
  return rlt || {};
});

// 课程镜像路径
const backendPath = ref("");
// 课程镜像路径是否请求完成
const backendPathLoaded = ref(false);

// 章节列表
const chapterList = computed(() => {
  return courseInfo.value.chapters ? courseInfo.value.chapters : [];
});

window.chapterList = chapterList;
window.courseList = courseList;

// 章节标题列表
const chapterTitleList = computed(() => {
  return chapterList.value.map((chapter, idx) => {
    const title = chapter.title || "";
    return {
      id: chapter.content_dir,
      title: `第${toNumCN(idx + 1)}章 ${title}`,
    };
  });
});

// 当前章节索引
const currentChapterIdx = computed(() => {
  return chapterList.value.findIndex((item) => {
    return item.content_dir === chapterPath.value;
  });
});

// 当前章节标题
const currentChapterTitle = computed(() => {
  return (
    (chapterTitleList.value[currentChapterIdx.value] &&
      chapterTitleList.value[currentChapterIdx.value].title) ||
    ""
  );
});

// 当前步骤索引，0：开始； -1：结束； 其他：中间步骤
const currentStepIdx = ref(0);

// 当前步骤
const currentStep = computed(() => {
  return stepList.value[currentStepIdx.value - 1] || {};
});

// 镜像信息是否加载完成
const resourceLoaded = computed(() => {
  return (
    courseList.value.length && chapterList.value && backendPathLoaded.value
  );
});

// 镜像资源列表
const resourceList = ref([]);

// 镜像资源请求完成
watch(
  () => {
    return resourceLoaded.value;
  },
  (val) => {
    if (val) {
      for (let i = 0, len = chapterList.value.length; i < len; i++) {
        resourceList.value.push({
          courseId: courseInfo.value._course.id,
          chapterId: chapterList.value[i].content_dir,
          backend: backendPath.value,
          email: courseData.resource.email,
          timeout: courseData.resource.timeout,
          query_interval: courseData.resource.query_interval,
        });
      }
    }
  }
);

const dropdown = ref(null);

// 输入命令
function handleCommandClick(e) {
  console.log(e.command);
  mitt.emit(PLAYGROUND_KEYS.ENTER, { commond: e.command });
}

mitt.on(PLAYGROUND_KEYS.ENTER, (data) => {
  terminals.value && terminals.value.enterCommond(data.commond);
});

// 开始章节
function startChapter() {
  setCourseStatus({
    courseId: courseInfo.value._course.id,
    status: 1,
    // chapterInfo: {
    //   chapterId: chapterList.value[index].content_dir,
    //   status: 1,
    // },
  });
  mitt.emit(PLAYGROUND_KEYS.START, currentStepIdx.value);
  currentStepIdx.value++;
}

mitt.on(PLAYGROUND_KEYS.START, (index) => {
  terminals.value && terminals.value.addTerminal(false, index);
});

// 是否显示结束对话框
const showFinishDialog = ref(false);

// 结束章节
function finishChapter() {
  setCourseStatus({
    courseId: courseInfo.value._course.id,
    chapterId: chapterList.value[currentChapterIdx.value].content_dir,
    status: 2,
  });
  toggleFinishDialog(true);
}

// 切换结束对话框
function toggleFinishDialog(flag) {
  if (flag === undefined) {
    showFinishDialog.value = !showFinishDialog.value;
  } else {
    showFinishDialog.value = flag;
  }
}

// 上一步
function handlePrevClick() {
  if (currentStepIdx.value === 0) {
    return;
  }
  if (currentStepIdx.value > 0) {
    currentStepIdx.value--;
  }
}

// 下一步
function handleNextClick() {
  if (currentStepIdx.value === -1) {
    return;
  }
  if (currentStepIdx.value < stepList.value.length) {
    currentStepIdx.value++;
  } else {
    currentStepIdx.value = -1;
  }
}

function handleItemClick(idx) {
  currentStepIdx.value = idx + 1;
}

// 跳转至某一章节
function gotoChapter(idx) {
  if (idx >= 0 && idx < chapterList.value.length) {
    toggleFinishDialog(false);
    terminals.value && terminals.value.closeAllTerminal();
    const item = chapterList.value[idx];
    if (item && item.content_dir) {
      router.push({
        path: `/course/${coursePath.value}/chapter/${item.content_dir}`,
      });
    }
  }

  toggleFinishDialog(false);
}

// 重新开始某一章节
function restartChapter() {
  showFinishDialog.value = false;
  terminals.value && terminals.value.closeAllTerminal();
  currentStepIdx.value = 0;
}

function onTerminalLoaded() {}

function onTerminalDisconnect() {}

// 获取章节具体信息
function getChapterDetail() {
  queryChapterDetail(coursePath.value, chapterPath.value).then((data) => {
    const { details, backend } = data;
    backendPathLoaded.value = true;
    backendPath.value = backend.image_id;
    introduction.value = details.introduction;
    stepList.value = details.steps;
    finish.value = details.finish;
  });
}

getChapterDetail();

// 路由更新
onBeforeRouteUpdate((to) => {
  const { params } = to;

  terminals.value && terminals.value.closeAllTerminal(); // 关闭terminal
  dropdown.value.toggleMenu(false); // 下拉菜单收起
  currentStepIdx.value = 0; // 步骤置为0

  // 路由信息更新
  coursePath.value = params.coursePath;
  chapterPath.value = params.chapterPath;

  // 镜像资源信息更新
  resourceList.value = [];
  backendPathLoaded.value = false;
  backendPath.value = "";

  // 重新获取章节信息
  getChapterDetail();
});
</script>

<template>
  <template v-if="isLogined">
    <div class="chapter-header">
      <div class="chapter-header-tool">
        <div class="tool-dropdown">
          <o-dropdown ref="dropdown">
            <div class="dropdown-icon">
              <div class="row"></div>
              <div class="row"></div>
              <div class="row"></div>
            </div>
            <template #menu>
              <o-drop-down-item
                v-for="(item, idx) in chapterTitleList"
                :key="item.id"
                class="dropdown-item"
                @click="gotoChapter(idx)"
              >
                {{ item.title }}
              </o-drop-down-item>
            </template>
          </o-dropdown>
          <div class="dropdown-label">{{ currentChapterTitle }}</div>
        </div>
      </div>
    </div>
    <div class="chapter-content">
      <div class="chapter-content-article">
        <template v-if="currentStepIdx == 0">
          <div class="article-top">
            <o-button
              v-if="resourceLoaded"
              primary
              icon="arrow-right"
              @click="startChapter"
              >{{ startBtnLabel }}</o-button
            >
          </div>

          <div class="article-bottom">
            <course-article
              :content="introduction.html"
              @command-click="handleCommandClick"
            ></course-article>
          </div>
        </template>

        <template v-if="currentStepIdx !== 0 && currentStepIdx !== -1">
          <div class="article-top" :class="{ reverse: true }">
            <chapter-step
              class="article-step"
              :count="stepList.length"
              :prev-disabled="currentStepIdx === 1"
              @prev-click="handlePrevClick"
              @next-click="handleNextClick"
              @item-click="handleItemClick"
            ></chapter-step>
          </div>
          <div ref="scroller" class="article-bottom">
            <course-article
              :content="currentStep.html"
              @command-click="handleCommandClick"
            ></course-article>
          </div>
        </template>

        <template v-if="currentStepIdx === -1">
          <div class="article-top">
            <o-button primary icon="arrow-right" @click="finishChapter">{{
              finishBtnLabel
            }}</o-button>
          </div>
          <div class="article-bottom">
            <course-article
              :content="finish.html"
              @command-click="handleCommandClick"
            ></course-article>
          </div>
        </template>
      </div>

      <div class="chapter-content-terminal">
        <terminal-mask v-if="currentStepIdx == 0 || !resourceLoaded">
          <p class="mask-info">Welcome</p>
          <p class="mask-info">LET'S PLAY _</p>
        </terminal-mask>
        <terminal-group
          ref="terminals"
          :max="5"
          :active-index="currentChapterIdx"
          :resource="resourceList"
          @terminal-loaded="onTerminalLoaded"
          @terminal-disconnect="onTerminalDisconnect"
        ></terminal-group>
      </div>
    </div>

    <o-dialog :show="showFinishDialog" @close-click="toggleFinishDialog(false)">
      <template #head>
        <div class="dlg-title">{{ finishDlgLabels.title }}</div>
      </template>
      <div class="dlg-body">{{ finishDlgLabels.info }}</div>
      <template #foot>
        <div class="dlg-actions">
          <o-button
            v-if="currentChapterIdx !== chapterList.length - 1"
            icon="arrow-right"
            primary
            :style="{ marginRight: '12px' }"
            @click="gotoChapter(currentChapterIdx + 1)"
            >{{ finishDlgLabels.nextBtn }}</o-button
          >
          <o-button primary @click="restartChapter">
            {{ finishDlgLabels.restartBtn }}</o-button
          >
        </div>
      </template>
    </o-dialog>
  </template>
</template>

<style lang="scss" scoped>
.chapter-header {
  height: 92px;
  background: #f5f7fb;
  position: relative;
  z-index: 2;

  &-tool {
    display: flex;
    justify-content: space-between;
    max-width: 1488px;
    height: 100%;
    margin: 0 auto;
    padding: 0 36px;
    @media screen and (max-width: 1023px) {
      padding: 0 24px;
    }

    .tool-dropdown {
      display: flex;
      align-items: center;
      height: 100%;
      .dropdown-icon {
        position: relative;
        width: 26px;
        height: 24px;
        cursor: pointer;

        .row:nth-child(1) {
          position: absolute;
          top: 0;
          left: 0;
          width: 26px;
          height: 2px;
          background: #000;
        }

        .row:nth-child(2) {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 22px;
          height: 2px;
          background: #000;
        }

        .row:nth-child(3) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 26px;
          height: 2px;
          background: #000;
          &:hover {
            background: #002fa7;
          }
        }

        &:hover {
          .row:nth-child(1),
          .row:nth-child(2),
          .row:nth-child(3) {
            background: #002fa7;
          }
        }

        &-text {
          margin-left: 16px;
          font-size: 24px;
          font-weight: normal;
          color: #000000;
          line-height: 28px;
        }
      }

      .dropdown-item {
        width: 300px;
        border-left: 1px solid rgba(0, 47, 167, 1);
        border-right: 1px solid rgba(0, 47, 167, 1);
        transition: color 0.2s, background-color 0.3s;
        &:first-child {
          border-top: 1px solid rgba(0, 47, 167, 1);
        }
        &:last-child {
          border-bottom: 1px solid rgba(0, 47, 167, 1);
        }
        &:nth-child(odd) {
          background: #f7f8fa;
        }

        &:nth-child(even) {
          background: #ffffff;
        }

        &:hover {
          background: #002fa7;
          color: #ffffff;
        }
      }

      .dropdown-label {
        margin-left: 16px;
        line-height: 28px;
        font-size: 24px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 400;
      }
    }
  }
}

.chapter-content {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
  height: calc(100vh - 172px);

  @media screen and (max-width: 1023px) {
    flex-direction: column;
    height: auto;
  }

  &-article {
    display: flex;
    flex-direction: column;
    width: 26.25%;
    height: 100%;
    padding: 32px 32px 50px;
    @media screen and (max-width: 1023px) {
      width: 100%;
    }

    .article-top {
      display: flex;
      margin-bottom: 32px;
      &.reverse {
        flex-direction: row-reverse;
      }
    }

    .article-bottom {
      height: 90%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  &-terminal {
    width: 73.75%;
    height: 100%;
    position: relative;

    @media screen and (max-width: 1023px) {
      width: 100%;
      height: calc(100vh - 172px);
    }

    .mask-info {
      font-size: 30px;
    }
  }
}
</style>
