<script setup>
import OButton from "@/components/OButton.vue";
import { useRouter, useRoute } from "vue-router";
import { courseList } from "@/shared/composition/course";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();
const { coursePath } = route.params;

const courseInfo = computed(() => {
  const rlt = courseList.value.find(
    (item) => item._courses.name === coursePath
  );
  return rlt || {};
});

function getBtnLabel(item) {
  console.log(item.title);
  return "开始课程";
}
function startCourse(item) {
  if (item.chapter_id) {
    router.push({
      path: `/course/${coursePath}/chapter/${item.chapter_id}`,
    });
  }
}
</script>
<template>
  <div class="sec-head">
    <div
      class="head-bg"
      :style="{ backgroundImage: `url(${courseInfo.poster})` }"
    ></div>
    <div class="content">
      <div class="title">{{ courseInfo.title }}</div>
      <div class="description">{{ courseInfo.description }}</div>
    </div>
  </div>
  <div class="chapter-list">
    <div
      v-for="item in courseInfo.chapters"
      :key="item.chapter_id"
      class="chapter-card"
    >
      <div class="card-head">
        <div class="course-logo">
          <img :src="courseInfo.logo" />
        </div>
        <div class="chapter-period">{{ item.estimated_time }}</div>
      </div>
      <div class="card-body">
        <div class="title">{{ item.title }}</div>
        <div class="detail">{{ item.description }}</div>
        <div class="buttons">
          <OButton primary @click="startCourse(item)">{{
            getBtnLabel(item)
          }}</OButton>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sec-head {
  height: 380px;
  position: relative;
  .head-bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #002fa7;
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

.chapter-list {
  display: flex;
  .chapter-card {
    margin: 0 25px;
  }
}
.chapter-card {
  position: relative;
  .card-head {
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .chapter-period {
    font-size: 12px;
    line-height: 14x;
    position: absolute;
    right: 12px;
    top: 12px;
    padding: 2px 4px;
    background-color: #e5e5e5;
    border-radius: 4px;
  }
}
</style>
