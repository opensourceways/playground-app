<script setup>
import { useRouter } from "vue-router";

import { courseList } from "@/shared/composition/course";

import OButton from "@/components/OButton.vue";
import OCard from "@/components/OCard.vue";

import bannerBg from "@/assets/bg/home-bg-banner.png";
import bannerRightBg from "@/assets/bg/home-bg-banner_right.png";
import sloganBg from "@/assets/bg/home-bg-slogan.png";
import sloganLeftBg from "@/assets/bg/home-bg-slogan_left.png";
import courseBoxBg from "@/assets/bg/home-bg-course_box.png";
import courseLeftBg from "@/assets/bg/home-bg-course_left.png";
import courseRightBg from "@/assets/bg/home-bg-course_right.png";

const router = useRouter();

// banner文字
const bannerLabels = {
  title: [
    { id: "first", text: "在浏览器中" },
    { id: "second", text: "使用真实环境学习新技术" },
  ],
  description: "软件工程师互动学习与培训平台",
};

// sologan文字
const sloganLables = {
  title: "Your first coding experience in openGauss",
  logo: "moocstudio",
  description: [
    { id: "first", text: "Moocstudio是集计算机课程编写和学习一体的教育平台" },
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
  <div class="mooc-banner" :style="{ backgroundImage: `url(${bannerBg})` }">
    <div
      class="mooc-banner-bg_right"
      :style="{ backgroundImage: `url(${bannerRightBg})` }"
    ></div>
    <div class="wrap">
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
    </div>
  </div>

  <div :style="{ backgroundImage: `url(${sloganBg})` }" class="mooc-slogan">
    <div
      class="mooc-slogan-bg_left"
      :style="{ backgroundImage: `url(${sloganLeftBg})` }"
    ></div>
    <div class="wrap">
      <div class="mooc-slogan-box">
        <p class="mooc-slogan-logo">{{ sloganLables.logo }}</p>
        <p class="mooc-slogan-title">{{ sloganLables.title }}</p>
        <p
          v-for="item in sloganLables.description"
          :key="item.id"
          class="mooc-slogan-desc"
        >
          {{ item.text }}
        </p>
      </div>
    </div>
  </div>

  <div class="mooc-course">
    <div
      v-show="courseList.length"
      class="mooc-course-bg_left"
      :style="{ backgroundImage: `url(${courseLeftBg})` }"
    ></div>
    <div
      v-show="courseList.length"
      class="mooc-course-bg_right"
      :style="{ backgroundImage: `url(${courseRightBg})` }"
    ></div>
    <div class="wrap">
      <div class="mooc-course-box">
        <div
          class="mooc-course-box_decorate"
          :style="{ backgroundImage: `url(${courseBoxBg})` }"
        ></div>
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
              // backgroundImage: `url(${item.cover})`,
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mooc-banner {
  width: 100%;
  background-color: var(--gauss-color-primary);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  .mooc-banner-bg_right {
    position: absolute;
    top: 38%;
    left: 68%;
    width: 136px;
    height: 174px;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    @media screen and (max-width: 1023px) {
      display: none;
    }
    @media screen and (min-width: 1921px) {
      left: 69%;
    }
  }
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1488px;
    margin: 0 auto;
    padding: 100px 36px 110px;
    position: relative;
    z-index: 1;

    @media screen and (max-width: 1023px) {
      padding: 50px 36px 55px;
    }

    .mooc-banner-label {
      font-size: 64px;
      color: var(--gauss-text-color-light);
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
        color: var(--gauss-text-color-light);
        letter-spacing: 0;
        line-height: 32px;
        font-weight: 400;
        opacity: 0.8;

        @media screen and (max-width: 1023px) {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
}

.mooc-slogan {
  width: 100%;
  background-color: var(--gauss-color-primary);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;

  .mooc-slogan-bg_left {
    position: absolute;
    top: -40px;
    left: -30px;
    width: 288px;
    height: 255px;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .wrap {
    max-width: 1488px;
    margin: 0 auto;
    padding: 0 36px;

    .mooc-slogan-box {
      width: 100%;
      background: var(--gauss-bg-color);
      padding: 64px 36px 40px;
      position: relative;

      .mooc-slogan-logo {
        user-select: none;
        position: absolute;
        max-width: 100%;
        overflow: hidden;
        font-size: 72px;
        font-weight: bold;
        color: var(--gauss-color-primary);
        line-height: 85px;
        letter-spacing: 21px;
        opacity: 0.1;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
      }

      .mooc-slogan-title {
        font-size: 40px;
        font-weight: normal;
        color: var(--gauss-color-primary);
        line-height: 48px;
        text-align: center;
        font-weight: bold;
      }

      .mooc-slogan-desc {
        margin-top: 4px;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: var(--gauss-text-color-gray);
        line-height: 24px;
      }
    }
  }
}

.mooc-course {
  width: 100%;
  background-color: #7721f4;
  position: relative;

  .mooc-course-bg_left {
    position: absolute;
    top: 90px;
    left: 0;
    width: 180px;
    height: 550px;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .mooc-course-bg_right {
    position: absolute;
    top: 143px;
    right: 0;
    width: 209px;
    height: 267px;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .wrap {
    max-width: 1488px;
    margin: 0 auto;
    padding: 60px 36px 96px;

    .mooc-course-box {
      width: 100%;
      padding: 60px 180px;
      background: var(--gauss-bg-color);
      position: relative;

      @media screen and (max-width: 1279px) {
        padding: 60px 64px;
      }

      @media screen and (max-width: 1023px) {
        padding: 60px 36px;
      }

      .mooc-course-box_decorate {
        position: absolute;
        top: 0;
        right: 0;
        width: 204px;
        height: 83px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
      }

      .mooc-course-title {
        text-align: center;
        font-size: 36px;
        font-weight: normal;
        color: var(--gauss-text-color-dark);
        line-height: 48px;
      }

      .mooc-course-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(200px, 1fr));
        column-gap: 32px;
        row-gap: 32px;
        margin-top: 32px;
        @media screen and (max-width: 1023px) {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .card {
          background-color: var(--gauss-color-white);
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
              object-fit: contain;
              vertical-align: top;
            }

            .title {
              margin-top: 20px;
              font-size: 18px;
              font-weight: normal;
              color: var(--gauss-text-color-dark);
              line-height: 24px;
            }

            .detail {
              margin-top: 4px;
              font-size: 14px;
              font-weight: normal;
              color: var(--gauss-text-color-gray);
              line-height: 22px;
            }
          }

          .card-operate {
            margin-top: 48px;
          }
        }
      }
    }
  }
}
</style>
