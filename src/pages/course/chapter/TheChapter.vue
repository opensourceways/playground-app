<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import mitt from "@/shared/mitt";

import Courses from "@/configs/courses";
import { courseList } from "@/shared/composition/course";
import { queryChapterDetail } from "@/service/courseAPI";
import { setCourseStatus } from "@/service/api";

import { PLAYGROUND_KEYS, PLAYGROUND_PAGES } from "@/pages/playground/shared";
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
import RemainTime from "@/pages/playground/RemainTime.vue";

const courseData = Courses.experience;

const route = useRoute();
const router = useRouter();

const coursePath = ref(route.params.coursePath);
const chapterPath = ref(route.params.chapterPath);

const terminals = ref(null);
const remainTimeIns = ref(null);
const scroller = ref(null);
const dropdown = ref(null);

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
  info: "恭喜你完成本门课程，进一寸有进一寸的欢喜~",
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
      mitt.emit(PLAYGROUND_PAGES.BACK_TO_HOME);
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

// 当前文章内容
const articleHtml = computed(() => {
  if (currentStepIdx.value === 0) {
    return introduction.value;
  } else if (currentStepIdx.value === -1) {
    return finish.value;
  } else {
    return stepList.value[currentStepIdx.value - 1] || {};
  }
});

// 滚动条置顶
watch(
  () => {
    return currentStepIdx.value;
  },
  () => {
    scroller.value.scrollTop = 0;
  }
);

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

// 输入命令
function handleCommandClick(e) {
  console.log({ type: e.type, command: e.command });
  mitt.emit(PLAYGROUND_KEYS.ENTER, { type: e.type, commond: e.command });
}

mitt.on(PLAYGROUND_KEYS.ENTER, (data) => {
  terminals.value && terminals.value.enterCommond(data.type, data.commond);
});

// 开始章节
function startChapter() {
  setCourseStatus({
    courseId: courseInfo.value._course.id,
    status: 1,
    chapterInfo: [
      {
        chapterId: chapterList.value[currentChapterIdx.value].content_dir,
        status: 1,
      },
    ],
  });
  mitt.emit(PLAYGROUND_KEYS.START, currentChapterIdx.value);
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
    status: 1,
    chapterInfo: [
      {
        chapterId: chapterList.value[currentChapterIdx.value].content_dir,
        status: 2,
      },
    ],
  });
  toggleFinishDlg(true);
}

// 切换结束对话框
function toggleFinishDlg(flag) {
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

// 中间某一步
function handleItemClick(idx) {
  currentStepIdx.value = idx + 1;
}

// 跳转至某一章节
function gotoChapter(idx) {
  if (idx >= 0 && idx < chapterList.value.length) {
    toggleFinishDlg(false);
    terminals.value && terminals.value.closeAllTerminal();
    const item = chapterList.value[idx];
    if (item && item.content_dir) {
      router.push({
        path: `/course/${coursePath.value}/chapter/${item.content_dir}`,
      });
    }
  }

  toggleFinishDlg(false);
}

// 终端是否加载
const terminalLoaded = ref(false);
// 是否显示剩余时间
const showRemainTime = computed(() => {
  return currentStepIdx.value !== 0 && terminalLoaded.value;
});
// 是否显示倒计时对话框
const showTimeoutDlg = ref(false);
// 切换倒计时对话框
function toggleTimeoutDlg(show) {
  showTimeoutDlg.value = show;
}
// 倒计时对话框文字内容
const timeoutDlgSet = {
  title: "提示",
  content: "体验时间已结束，欢迎再来，还有更多的精品课程等你体验。",
  buttons: [
    {
      id: 0,
      label: "返回首页",
      primary: true,
      style: { marginRight: "24px" },
      click() {
        toggleTimeoutDlg(false);
        mitt.emit(PLAYGROUND_PAGES.BACK_TO_HOME);
      },
    },
    {
      id: 1,
      label: "重新开始",
      icon: "arrow-right",
      isText: true,
      click() {
        restartChapter();
      },
    },
  ],
};

// 重新开始某一章节
function restartChapter() {
  toggleFinishDlg(false);
  toggleTimeoutDlg(false);
  terminalLoaded.value = false;
  remainTimeIns.value.reset();
  terminals.value && terminals.value.closeAllTerminal();
  currentStepIdx.value = 0;
}

// handle terminal loaded
function handleTerminalLoaded(data) {
  terminalLoaded.value = true;
  remainTimeIns.value.updateTime(data.terminal.remainSecond);
}

// handle terminal disconnect
function handleTerminalDisconnect() {
  remainTimeIns.value.reset();
}

// handle timeout
function handleTimeout() {
  terminals.value && terminals.value.disconnectAllTerminal();
  toggleTimeoutDlg(true);
}

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

  // 关闭terminal
  terminals.value && terminals.value.closeAllTerminal();
  terminalLoaded.value = false;
  // 重置倒计时
  remainTimeIns.value.reset();
  // 下拉菜单收起
  dropdown.value.toggleMenu(false);
  // 步骤置为0
  currentStepIdx.value = 0;
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
        <remain-time
          v-show="showRemainTime"
          ref="remainTimeIns"
          @timeout="handleTimeout"
        ></remain-time>
      </div>
    </div>
    <div class="chapter-content">
      <div class="chapter-content-article">
        <div
          class="article-top"
          :class="{ reverse: currentStepIdx !== 0 && currentStepIdx !== -1 }"
        >
          <template v-if="currentStepIdx == 0">
            <o-button
              v-if="resourceLoaded"
              primary
              icon="arrow-right"
              @click="startChapter"
              >{{ startBtnLabel }}</o-button
            >
          </template>

          <template v-if="currentStepIdx !== 0 && currentStepIdx !== -1">
            <chapter-step
              class="article-step"
              :count="stepList.length"
              :active-index="currentStepIdx"
              :prev-disabled="currentStepIdx === 1"
              @prev-click="handlePrevClick"
              @next-click="handleNextClick"
              @item-click="handleItemClick"
            ></chapter-step
          ></template>

          <template v-if="currentStepIdx === -1">
            <o-button primary icon="arrow-right" @click="finishChapter">{{
              finishBtnLabel
            }}</o-button>
          </template>
        </div>

        <div ref="scroller" class="article-bottom">
          <course-article
            :content="articleHtml.html"
            @command-click="handleCommandClick"
          ></course-article>
        </div>
      </div>

      <div class="chapter-content-terminal">
        <terminal-mask v-if="currentStepIdx == 0 || !resourceLoaded">
          <p class="mask_label">Welcome</p>
          <p class="mask_label">LET'S PLAY<span class="bling">_</span></p>
        </terminal-mask>
        <terminal-group
          ref="terminals"
          :max="5"
          :active-index="currentChapterIdx"
          :resource="resourceList"
          @terminal-loaded="handleTerminalLoaded"
          @terminal-disconnect="handleTerminalDisconnect"
        ></terminal-group>
      </div>
    </div>

    <o-dialog :show="showFinishDialog" @close-click="toggleFinishDlg(false)">
      <template #head>
        <div class="dlg-title">{{ finishDlgLabels.title }}</div>
      </template>
      <div class="dlg-body">{{ finishDlgLabels.info }}</div>
      <template #foot>
        <div class="dlg-actions">
          <o-button
            v-if="currentChapterIdx !== chapterList.length - 1"
            primary
            :style="{ marginRight: '24px' }"
            @click="gotoChapter(currentChapterIdx + 1)"
            >{{ finishDlgLabels.nextBtn }}</o-button
          >
          <o-button icon="arrow-right" is-text @click="restartChapter">
            {{ finishDlgLabels.restartBtn }}</o-button
          >
        </div>
      </template>
    </o-dialog>

    <o-dialog :show="showTimeoutDlg" :close="false">
      <template #head>
        <div class="dlg-title">{{ timeoutDlgSet.title }}</div>
      </template>
      <div class="dlg-body">{{ timeoutDlgSet.content }}</div>
      <template #foot>
        <div class="dlg-actions">
          <o-button
            v-for="btn in timeoutDlgSet.buttons"
            :key="btn.id"
            :primary="btn.primary"
            :icon="btn.icon"
            :is-text="btn.isText"
            :style="btn.style"
            @click="btn.click(btn)"
            >{{ btn.label }}</o-button
          >
        </div>
      </template>
    </o-dialog>
  </template>
</template>

<style lang="scss" scoped>
@keyframes bling {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.chapter-header {
  height: 80px;
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
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .row {
          width: 20px;
          height: 2px;
          background-color: #000000;

          &:nth-child(2) {
            width: 16px;
          }
        }

        &:hover {
          .row:nth-child(1),
          .row:nth-child(2),
          .row:nth-child(3) {
            background: #002fa7;
          }
        }
      }

      .dropdown-item {
        min-width: 300px;
        transition: color 0.2s, background-color 0.3s;

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
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        line-height: 28px;
      }
    }
  }
}

.chapter-content {
  display: flex;
  width: 100%;
  position: relative;
  background-color: #ffffff;
  z-index: 1;
  height: calc(100vh - 172px);

  @media screen and (max-width: 1023px) {
    flex-direction: column;
    height: auto;
  }

  &-article {
    display: flex;
    flex-direction: column;
    width: 38.2%;
    height: 100%;
    padding: 32px 0 50px;
    @media screen and (max-width: 1023px) {
      width: 100%;
    }

    .article-top {
      display: flex;
      padding: 0 32px 0 32px;
      margin-bottom: 32px;
      &.reverse {
        flex-direction: row-reverse;
      }
    }

    .article-bottom {
      height: 90%;
      padding-right: 20px;
      margin-right: 12px;
      padding-left: 32px;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        height: 0;
        background-color: #d8d8d8;
        background-clip: content-box;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
  }

  &-terminal {
    width: 61.2%;
    height: 100%;
    position: relative;

    @media screen and (max-width: 1023px) {
      width: 100%;
      height: calc(100vh - 172px);
    }

    .mask_label {
      font-size: 49px;
      font-weight: 400;
      color: #d0f2ff;
      line-height: 49px;

      & + .mask_label {
        margin-top: 27px;
        .bling {
          animation: bling 2s infinite reverse;
        }
      }
    }
  }
}

.dlg-title {
  height: 32px;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0;
  line-height: 32px;
  font-weight: bold;
}

.dlg-body {
  font-size: 14px;
  color: #555555;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
}
</style>
