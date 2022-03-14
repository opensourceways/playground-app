<script setup>
import { useRouter } from "vue-router";

import { courseList } from "@/shared/composition/course";

import OButton from "@/components/OButton.vue";
import OCard from "@/components/OCard.vue";

import bannerImg from "@/assets/banner/banner.png";
import floorImg from "@/assets/banner/banner-floor.png";

const router = useRouter();

// banner文字
const bannerLabels = {
  title: [
    { id: "first", text: "在浏览器中" },
    { id: "second", text: "使用真实环境学习新技术" },
  ],
  description: "软件工程师互动学习与培训平台",
};

// introduction文字
const introLabels = {
  title: "moocstudio",
  detail: [
    { id: "first", text: "免费的、交互式的、基于工具的学习平台" },
    {
      id: "second",
      text: "我们提供了实时交互式演示和运行环境，用户可以根据自己的需求定制课程，分步指导路径确保用户以最佳方式学习。",
    },
  ],
};

// course文字
const courseLabels = {
  title: "最新课程",
  startBtn: "开始课程",
};

// 进入课程
function gotoCourse(item) {
  router.push({
    path: `/course/${item._course.content_dir}`,
  });
}
</script>

<template>
  <div class="mooc-banner">
    <div class="mooc-banner-label">
      <p
        v-for="item in bannerLabels.title"
        :key="item.id"
        class="banner-label-title"
      >
        {{ item.text }}
      </p>
      <p class="banner-label-desc">{{ bannerLabels.description }}</p>
    </div>
    <div class="mooc-banner-img">
      <img :src="bannerImg" alt="" />
    </div>
  </div>

  <div :style="{ backgroundImage: `url(${floorImg})` }" class="mooc-intro">
    <p class="mooc-intro-title">{{ introLabels.title }}</p>
    <p
      v-for="item in introLabels.detail"
      :key="item.id"
      class="mooc-intro-detail"
    >
      {{ item.text }}
    </p>
  </div>

  <div class="mooc-course">
    <div class="mooc-course-title">{{ courseLabels.title }}</div>
    <div class="mooc-course-list">
      <o-card
        v-for="item in courseList"
        :key="item.id"
        :body-style="{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `url(${item.cover})`,
        }"
        class="card"
      >
        <div class="card-content">
          <img :src="item.logo" class="logo" />
          <p class="title">{{ item.title }}</p>
          <p class="detail">{{ item.description }}</p>
        </div>
        <div class="card-operate">
          <o-button primary icon="arrow-right" @click="gotoCourse(item)">{{
            courseLabels.startBtn
          }}</o-button>
        </div>
      </o-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mooc-banner {
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

  &-label {
    font-size: 64px;
    color: #000000;
    letter-spacing: 0;
    line-height: 84px;
    font-weight: 500;
    @media screen and (max-width: 1023px) {
      font-size: 40px;
      line-height: 48px;
    }

    .banner-label-desc {
      margin-top: 10px;
      font-size: 24px;
      color: #000000;
      letter-spacing: 0;
      line-height: 32px;
      font-weight: 400;

      @media screen and (max-width: 1023px) {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  &-img {
    max-width: 100%;
    width: 600px;
    height: 400px;

    // @media screen and (max-width: 1023px) {
    //   margin-top: 32px;
    // }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      vertical-align: top;
    }
  }
}

.mooc-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 76px 36px;
  font-weight: normal;
  color: #ffffff;
  background-color: #002fa7;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media screen and (max-width: 1023px) {
    padding: 76px 24px;
  }

  &-title {
    font-size: 36px;
    letter-spacing: 0;
    text-align: center;
    line-height: 48px;
    text-align: center;
  }

  &-detail {
    margin-top: 4px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 0;
    text-align: center;
    line-height: 24px;
  }
}

.mooc-course {
  max-width: 1460px;
  margin: 0 auto;
  padding: 60px 36px 198px 36px;
  @media screen and (max-width: 1023px) {
    padding: 60 24px 198px 24px;
  }

  &-title {
    text-align: center;
    height: 48px;
    font-size: 36px;
    font-weight: normal;
    color: #000000;
    line-height: 48px;
  }

  &-list {
    max-width: 1460px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, minmax(200px, 1fr));
    column-gap: 32px;
    row-gap: 32px;
    margin-top: 32px;
    @media screen and (max-width: 1023px) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .card {
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
      }
    }
  }
}
</style>
