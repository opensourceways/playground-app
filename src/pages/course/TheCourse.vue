<script setup>
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import mitt from "@/shared/mitt";

import {
  isLoginNot,
  isLogined,
  isLoginFailed,
  LOGIN_EVENTS,
} from "@/shared/login";
import { courseList } from "@/shared/composition/course";
import { queryCourseStatus } from "@/service/api";

import OButton from "@/components/OButton.vue";
import OCard from "@/components/OCard.vue";

import bannerBg from "@/assets/bg/course-bg-banner.png";

const router = useRouter();
const route = useRoute();
const { coursePath } = route.params;

// 课程信息
const courseInfo = computed(() => {
  const rlt = courseList.value.find((item) => {
    return item._course.content_dir === coursePath;
  });
  return rlt || {};
});

// 用户学习进度是否请求完成
const statusInfoLoaded = ref(false);
// 开始按钮文字
const startBtnLabels = ["开始课程", "继续学习"];

// 开始课程
function startCourse(item) {
  if (!isLogined.value) {
    mitt.emit(LOGIN_EVENTS.SHOW_LOGIN);
  } else if (item.content_dir) {
    router.push({
      path: `/course/${coursePath}/chapter/${item.content_dir}`,
    });
  }
}

// 课程进度信息
const courseStatusInfo = ref([]);
// 章节进度信息
const chapterStatus = computed(() => {
  const rlt = new Map();
  const chapterStatusInfo = courseStatusInfo.value.find((item) => {
    return item.courseId === courseInfo.value._course.id;
  });
  const info = chapterStatusInfo && chapterStatusInfo.chapterInfo;
  if (info && info.length) {
    info.forEach((item) => {
      rlt.set(item.chapterId, item.status);
    });
  }
  return rlt;
});

// 登录后获取用户学习进度
watch(
  () => {
    return isLogined.value;
  },
  (val) => {
    if (val) {
      try {
        queryCourseStatus().then((res) => {
          if (res.code == 200) {
            statusInfoLoaded.value = true;
            courseStatusInfo.value = res.courseInfo;
          } else {
            console.error(`获取用户学习进度信息失败！`);
          }
        });
      } catch (error) {
        console.error(`获取用户学习进度信息失败！`);
      }
    }
  },
  { immediate: true }
);

const showButton = computed(() => {
  if (isLoginNot.value || isLoginFailed.value || statusInfoLoaded.value) {
    return true;
  }
  return false;
});
</script>

<template>
  <div class="course-banner" :style="{ backgroundImage: `url(${bannerBg})` }">
    <div class="wrap">
      <div class="course-banner-label">
        <p class="banner-label-title">{{ courseInfo.title }}</p>
        <p class="banner-label-desc">{{ courseInfo.description }}</p>
      </div>
    </div>
  </div>
  <div class="course-chapter">
    <div class="wrap">
      <o-card
        v-for="item in courseInfo.chapters"
        :key="item.chapter_id"
        :body-style="{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }"
        class="card"
      >
        <div class="card-content">
          <img :src="courseInfo.logo" alt="" />
          <p class="title">{{ item.title }}</p>
          <p class="detail">{{ item.description }}</p>
        </div>

        <div class="card-bandage">{{ item.estimated_time }}</div>

        <div class="card-operate">
          <o-button
            v-show="showButton"
            :primary="isLogined"
            icon="arrow-right"
            :class="{
              'is-learned': chapterStatus.get(item.content_dir),
              'is-plain': !isLogined,
            }"
            @click="startCourse(item)"
            >{{
              chapterStatus.get(item.content_dir)
                ? startBtnLabels[1]
                : startBtnLabels[0]
            }}</o-button
          >
        </div>
      </o-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-banner {
  width: 100%;
  background: var(--euler-color-primary);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;

  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1488px;
    margin: 0 auto;
    padding: 100px 36px 90px;
    @media screen and (max-width: 1023px) {
      padding: 50px 36px 45px;
    }

    .course-banner-label {
      .banner-label-title {
        font-size: 54px;
        color: var(--euler-text-color-light);
        letter-spacing: 0;
        line-height: 76px;
        font-weight: 500;
        @media screen and (max-width: 1023px) {
          font-size: 40px;
          line-height: 48px;
        }
      }
      .banner-label-desc {
        margin-top: 6px;
        font-size: 20px;
        color: var(--euler-text-color-light);
        letter-spacing: 0;
        line-height: 28px;
        font-weight: 400;
        opacity: 0.8;

        @media screen and (max-width: 1023px) {
          // font-size: 16px;
          // line-height: 20px;
        }
      }
    }
  }
}

.course-chapter {
  width: 100%;
  background-color: var(--euler-bg-color);
  .wrap {
    max-width: 1488px;
    margin: 0 auto;
    padding: 60px 36px 96px 36px;
    display: grid;
    grid-template-columns: repeat(4, minmax(200px, 1fr));
    column-gap: 32px;
    row-gap: 32px;

    @media screen and (max-width: 1279px) {
      grid-template-columns: repeat(3, minmax(200px, 1fr));
    }

    @media screen and (max-width: 1023px) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .card {
      position: relative;
      background-color: var(--euler-color-white);
      box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);

      &:hover {
        box-shadow: 0px 4px 20px 4px rgba(190, 196, 204, 0.2);
      }
      .card-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        img {
          width: 48px;
          height: 48px;
          object-fit: center;
          vertical-align: top;
        }

        .title {
          margin-top: 20px;
          font-size: 18px;
          font-weight: normal;
          color: var(--euler-text-color-dark);
          line-height: 24px;
        }

        .detail {
          margin-top: 4px;
          font-size: 14px;
          font-weight: normal;
          color: var(--euler-text-color-gray);
          line-height: 22px;
        }
      }

      .card-operate {
        margin-top: 48px;
        min-height: 48px;

        .is-learned {
          background-color: var(--euler-color-yellow-1);
          border-color: var(--euler-color-yellow-1);
          &:hover {
            background-color: var(--euler-color-yellow-2);
            border-color: var(--euler-color-yellow-2);
          }
        }

        .is-plain {
          color: var(--euler-text-color-light);
          background: var(--euler-color-gray-1);
          border-color: var(--euler-color-gray-1);
        }
      }

      .card-bandage {
        position: absolute;
        top: 0;
        right: 12px;
        padding: 3px 6px;
        font-size: 12px;
        font-weight: normal;
        color: var(--euler-text-color-dark);
        line-height: 14px;
        background: var(--euler-color-yellow-3);
      }
    }
  }
}
</style>
