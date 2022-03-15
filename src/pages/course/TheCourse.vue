<script setup>
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { isLogined } from "@/shared/login";
import { courseList } from "@/shared/composition/course";
import { queryCourseStatus } from "@/service/api";

import OButton from "@/components/OButton.vue";
import OCard from "@/components/OCard.vue";

import bannerImg from "@/assets/banner/banner-course.png";

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
  if (item.content_dir) {
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

window.chapterStatus = chapterStatus;
window.courseInfo = courseInfo;
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
</script>

<template>
  <div class="course-banner">
    <div class="wrap">
      <div class="course-banner-label">
        <p class="banner-label-title">{{ courseInfo.title }}</p>
        <p class="banner-label-desc">{{ courseInfo.description }}</p>
      </div>
      <div class="course-banner-img">
        <img :src="bannerImg" alt="" />
      </div>
    </div>
  </div>
  <div class="course-chapter">
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
          :disabled="!isLogined"
          :primary="isLogined"
          icon="arrow-right"
          :class="{ 'is-learned': chapterStatus.get(item.content_dir) }"
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
</template>

<style lang="scss" scoped>
.course-banner {
  background: #002fa7;

  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1488px;
    margin: 0 auto;
    padding: 40px 36px;
    @media screen and (max-width: 1023px) {
      padding: 40px 24px;
      flex-direction: column;
      align-items: center;
    }
  }

  &-label {
    .banner-label-title {
      font-size: 54px;
      color: #ffffff;
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
      color: #ffffff;
      letter-spacing: 0;
      line-height: 28px;
      font-weight: 400;

      @media screen and (max-width: 1023px) {
        font-size: 16px;
        line-height: 20px;
      }
    }
  }

  &-img {
    max-width: 100%;
    width: 400px;
    height: 300px;

    @media screen and (max-width: 1023px) {
      margin-top: 32px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      vertical-align: top;
    }
  }
}

.course-chapter {
  max-width: 1460px;
  margin: 0 auto;
  padding: 100px 36px 160px 36px;
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
  column-gap: 32px;
  row-gap: 32px;

  @media screen and (max-width: 1023px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .card {
    position: relative;
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
        color: #000000;
        line-height: 24px;
      }

      .detail {
        margin-top: 4px;
        font-size: 14px;
        font-weight: normal;
        color: #555555;
        line-height: 22px;
      }
    }

    .card-operate {
      margin-top: 48px;

      // TODO:hover态颜色
      .is-learned {
        background-color: #feb32a;
        border-color: #feb32a;
      }
    }

    .card-bandage {
      position: absolute;
      top: 0;
      right: 12px;
      padding: 3px 6px;
      font-size: 12px;
      font-weight: normal;
      color: #000000;
      line-height: 14px;
      background: #ffce76;
    }
  }
}
</style>
