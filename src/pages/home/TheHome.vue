<script setup>
import bannerImg from "@/assets/banner/banner.png";
// import { queryCourseListInfo } from "@/service/courseAPI";
// import { ref } from "vue";
import OButton from "@/components/OButton.vue";
import { useRouter } from "vue-router";
import { courseList } from "@/shared/composition/course";

const router = useRouter();

// banner
const bannerTilte = [
  { id: "first", text: "在浏览器中" },
  { id: "second", text: "使用真实环境学习新技术" },
];
const bannerTitleDesc = "软件工程师互动学习与培训平台";

// introduction
const introTitle = "moocstudio";
const introDetail = [
  { id: "first", text: "免费的、交互式的、基于工具的学习平台" },
  {
    id: "second",
    text: "我们提供了实时交互式演示和运行环境，用户可以根据自己的需求定制课程，分步指导路径确保用户以最佳方式学习。",
  },
];

// course

const btnLabel = "开始课程";

function gotoCourse(item) {
  router.push({
    path: `/course/${item._course.content_dir}`,
  });
}
</script>

<template>
  <div class="mooc-banner">
    <div class="mooc-banner-title">
      <p v-for="item in bannerTilte" :key="item.id">{{ item.text }}</p>
      <p class="banner-title-desc">{{ bannerTitleDesc }}</p>
    </div>
    <div class="mooc-banner-img">
      <img :src="bannerImg" alt="" />
    </div>
  </div>

  <div class="mooc-intro">
    <p class="mooc-intro-title">{{ introTitle }}</p>
    <p v-for="item in introDetail" :key="item.id" class="mooc-intro-detail">
      {{ item.text }}
    </p>
  </div>

  <div class="mooc-course">
    <div class="mooc-course-title">最新课程</div>
    <div class="mooc-course-list">
      <div
        v-for="item in courseList"
        :key="item.id"
        class="course-list-item"
        :style="{ backgroundImage: `url(${item.cover})` }"
      >
        <div class="item-content">
          <img :src="item.logo" class="logo" />
          <p class="title">{{ item.title }}</p>
          <div class="detail">{{ item.introduction }}</div>
        </div>
        <div class="item-operate">
          <o-button primary color="#fff" @click="gotoCourse(item)">{{
            btnLabel
          }}</o-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mooc-banner {
  display: flex;
  justify-content: space-between;
  max-width: 1488px;
  margin: 0 auto;
  padding: 40px 36px;

  &-title {
    margin-top: 53px;
    font-size: 64px;
    color: #000000;
    letter-spacing: 0;
    line-height: 84px;
    font-weight: 400;

    .banner-title-desc {
      margin-top: 10px;
      font-size: 24px;
      color: #000000;
      letter-spacing: 0;
      line-height: 32px;
      font-weight: 400;
    }
  }

  &-img {
    width: 600px;
    height: 400px;

    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
}

.mooc-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 36px;
  background-color: rgb(0, 42, 157);
  font-weight: normal;
  color: #ffffff;

  &-title {
    font-size: 36px;
    line-height: 48px;
    text-align: center;
  }

  &-detail {
    font-size: 18px;
    line-height: 24px;
    margin-top: 24px;
    text-align: center;

    & + & {
      margin-top: 12px;
    }
  }
}

.mooc-course {
  max-width: 1156px;
  margin: 0 auto;
  padding: 60px 36px 220px 36px;

  &-title {
    text-align: center;
    height: 48px;
    font-size: 36px;
    font-weight: normal;
    color: #000000;
    line-height: 48px;
  }

  &-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    column-gap: 32px;
    row-gap: 32px;
    margin-top: 30px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .course-list-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px;
      box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);

      .item-content {
        img {
          width: 100px;
          height: 100px;
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

      .item-operate {
        margin-top: 50px;
      }
    }
  }
}
</style>
