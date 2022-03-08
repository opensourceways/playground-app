<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

import Courses from "@/configs/courses";
import mitt from "@/shared/mitt";
import { courseList } from "@/shared/composition/course";
import { queryChapterDetail } from "@/service/courseAPI";
import { PLAYGROUND_KEYS } from "@/pages/playground/shared";
import { toNumCN } from "@/shared/utils";

import ODialog from "@/components/ODialog.vue";
import ODropdown from "@/components/ODropdown.vue";
import OButton from "@/components/OButton.vue";
import CourseArticle from "@/components/CourseArticle.vue";
import ChapterStep from "@/pages/course/chapter/ChapterStep.vue";
import TerminalGroup from "@/components/TerminalGroup.vue";

const courseData = Courses.experience;

const route = useRoute();
const router = useRouter();

const coursePath = ref(route.params.coursePath);
const chapterPath = ref(route.params.chapterPath);
const terminals = ref(null);

const introduction = ref({});
const stepList = ref([]);
const finish = ref({});

// 章节
const chapterList = computed(() => {
  const rlt = courseList.value.find((item) => {
    return item._course.content_dir === coursePath.value;
  });

  return rlt ? rlt.chapters : [];
});

const chapterTitleList = computed(() => {
  return chapterList.value.map((chapter, idx) => {
    const title = chapter.title || "";
    return {
      id: chapter.content_dir,
      title: `第${toNumCN(idx + 1)}章 ${title}`,
    };
  });
});

const currentChapterIdx = computed(() => {
  let index;
  for (let i = 0, len = chapterList.value.length; i < len; i++) {
    let item = chapterList.value[i];
    if (item.content_dir === chapterPath.value) {
      index = i;
      break;
    }
  }
  return index;
});

const currentChapterTitle = computed(() => {
  return (
    (chapterTitleList.value[currentChapterIdx.value] &&
      chapterTitleList.value[currentChapterIdx.value].title) ||
    ""
  );
});

// 开始课程
const startBtnLabel = "START";
// 步骤
const currentStepIdx = ref(0);
const currentStep = computed(() => {
  return stepList.value[currentStepIdx.value - 1] || {};
});
// 结束课程
const finishBtnLabel = "FINISH";
const showFinishDialog = ref(false);

// 获取章节具体信息
function getChapterDetail() {
  queryChapterDetail(coursePath.value, chapterPath.value).then((data) => {
    const { details } = data;
    introduction.value = details.introduction;
    stepList.value = details.steps;
    finish.value = details.finish;
  });
}

getChapterDetail();

function exec(e) {
  console.log(e.command);
}

function startChapter() {
  currentStepIdx.value++;
  mitt.emit(PLAYGROUND_KEYS.START);
}

function toggleFinishDialog(flag) {
  if (flag === undefined) {
    showFinishDialog.value = !showFinishDialog.value;
  } else {
    showFinishDialog.value = flag;
  }
}

function onPrevClick() {
  if (currentStepIdx.value === 0) {
    return;
  }
  if (currentStepIdx.value > 0) {
    currentStepIdx.value--;
  }
}

function onNextClick() {
  if (currentStepIdx.value === -1) {
    return;
  }
  if (currentStepIdx.value < stepList.value.length) {
    currentStepIdx.value++;
  } else {
    currentStepIdx.value = -1;
  }
}

function gotoChapter(idx) {
  if (idx >= 0 && idx < chapterList.value.length) {
    showFinishDialog.value = false;

    const item = chapterList.value[idx];
    if (item && item.content_dir) {
      router.push({
        path: `/course/${coursePath.value}/chapter/${item.content_dir}`,
      });
    }
  }

  toggleFinishDialog(false);
}

function restartChapter() {
  showFinishDialog.value = false;
  currentStepIdx.value = 0;
}

function onTerminalLoaded() {}

function onTerminalDisconnect() {}

mitt.on(PLAYGROUND_KEYS.START, () => {
  terminals.value.addTerminal();
});

onBeforeRouteUpdate((to) => {
  const { params } = to;
  coursePath.value = params.coursePath;
  chapterPath.value = params.chapterPath;
  currentStepIdx.value = 0;
  getChapterDetail();
});
</script>

<template>
  <div class="chapter-header">
    <div class="chapter-header-tool">
      <div class="tool-dropdown">
        <o-dropdown>
          <div class="dropdown-icon">
            <div class="row"></div>
            <div class="row"></div>
            <div class="row"></div>
          </div>
          <template #menu>
            <div class="dropdown-menu" @click="hideMenu">
              <div
                v-for="(item, idx) in chapterTitleList"
                :key="item.id"
                class="dropdown-menu-item"
                @click="gotoChapter(idx)"
              >
                {{ item.title }}
              </div>
            </div>
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
          <course-article
            :content="introduction.html"
            @click="exec"
          ></course-article>
        </div>

        <div class="article-bottom">
          <o-button primary @click="startChapter">{{ startBtnLabel }}</o-button>
        </div>
      </template>

      <template v-if="currentStepIdx !== 0 && currentStepIdx !== -1">
        <div class="article-top">
          <course-article
            :content="currentStep.html"
            @click="exec"
          ></course-article>
        </div>
        <div class="article-bottom" :class="{ reverse: true }">
          <chapter-step
            class="article-step"
            @prev-click="onPrevClick"
            @next-click="onNextClick"
          ></chapter-step>
        </div>
      </template>

      <template v-if="currentStepIdx === -1">
        <div class="article-top">
          <course-article :content="finish.html" @click="exec"></course-article>
        </div>
        <div class="article-bottom">
          <o-button primary @click="toggleFinishDialog(true)">{{
            finishBtnLabel
          }}</o-button>
        </div>
      </template>
    </div>

    <div class="chapter-content-terminal">
      <div v-if="currentStepIdx == 0" class="terminal-mask">
        <p>Welcome</p>
        <p>LET'S PLAY _</p>
      </div>
      <terminal-group
        ref="terminals"
        :max="5"
        :resource="courseData.resource"
        @terminal-loaded="onTerminalLoaded"
        @terminal-disconnect="onTerminalDisconnect"
      ></terminal-group>
    </div>
  </div>

  <o-dialog :show="showFinishDialog" @close-click="toggleFinishDialog(false)">
    <template #head>
      <div class="dlg-title">课程完成！</div>
    </template>
    <div class="dlg-body">恭喜你完成本门课程，进一寸有进一寸的欢喜</div>
    <template #foot>
      <div class="dlg-actions">
        <o-button
          v-if="currentChapterIdx !== chapterList.length - 1"
          primary
          :style="{ marginRight: '12px' }"
          @click="gotoChapter(currentChapterIdx + 1)"
          >下一章节</o-button
        >
        <o-button primary @click="restartChapter">重新开始</o-button>
      </div>
    </template>
  </o-dialog>
</template>

<style lang="scss" scoped>
.chapter-header {
  height: 92px;
  background: #f5f7fb;
  position: relative;
  z-index: 1;

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

      .dropdown-menu {
        width: 300px;
        border: 1px solid #002fa7;

        &-item {
          width: 100%;
          height: 48px;
          padding: 0 20px;
          font-size: 14px;
          font-weight: normal;
          color: #000000;
          line-height: 48px;
          cursor: pointer;

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
  height: calc(100vh - 172px);

  &-article {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 26.25%;
    height: 100%;
    padding: 32px 32px 50px;
    overflow-y: auto;

    .article-top {
      max-height: 90%;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .article-bottom {
      display: flex;
      &.reverse {
        flex-direction: row-reverse;
      }
    }
  }

  &-terminal {
    width: 73.75%;
    height: 100%;
    position: relative;

    .terminal-mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      color: #eee;
      flex-direction: column;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      p {
        font-size: 30px;
      }
    }
  }
}
</style>
