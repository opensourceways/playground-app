<script setup>
import banner1 from "@/assets/banner/banner1.png";
// import { queryCourseListInfo } from "@/service/courseAPI";
// import { ref } from "vue";
import OButton from "@/components/OButton.vue";
import { useRouter } from "vue-router";
import { courseList } from "@/shared/composition/course";

const router = useRouter();

const btnLabel = "开始课程";

function gotoCourse(item) {
  router.push({
    path: `/course/${item._course.content_dir}`,
  });
}
</script>
<template>
  <div class="sec-head">
    <img :src="banner1" class="img" />
  </div>
  <div class="course-list">
    <div v-for="item in courseList" :key="item.id" class="course-card">
      <div class="card-head" :style="{ backgroundImage: `url(${item.cover})` }">
        <div class="course-logo">
          <img :src="item.logo" />
        </div>
      </div>
      <div class="card-body">
        <div class="title">{{ item.title }}</div>
        <div class="detail">{{ item.introduction }}</div>
        <div class="buttons">
          <OButton primary @click="gotoCourse(item)">{{ btnLabel }}</OButton>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sec-head {
  .img {
    width: 100%;
    vertical-align: top;
  }
}

.course-list {
  display: flex;
  .course-card {
    margin: 0 25px;
  }
}
.course-card {
  .card-head {
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
