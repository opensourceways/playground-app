<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { isLogined } from "@/shared/login";
import { courseList } from "@/shared/composition/course";

import OButton from "@/components/OButton.vue";

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

const startBtnLabel = "开始课程";

function startCourse(item) {
  if (item.content_dir) {
    router.push({
      path: `/course/${coursePath}/chapter/${item.content_dir}`,
    });
  }
}
</script>

<template>
  <div class="course-banner">
    <div
      class="course-banner-bg"
      :style="{ backgroundImage: `url(${courseInfo.poster})` }"
    ></div>
  </div>
  <div class="course-chapter">
    <div
      v-for="item in courseInfo.chapters"
      :key="item.chapter_id"
      class="course-chapter-card"
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
          @click="startCourse(item)"
          >{{ startBtnLabel }}</o-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-banner {
  height: 380px;
  position: relative;
  .course-banner-bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #002fa7;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .content {
    position: relative;
    z-index: 1;
    color: #fff;
    padding: 40px;
  }
  .title {
    font-size: 24px;
  }
  .detail {
    font-size: 16px;
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

  &-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32px;
    box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);
    background-color: #ffffff;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    &:hover {
      box-shadow: 0px 4px 20px 4px rgba(190, 196, 204, 0.2);
    }

    .card-content {
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
