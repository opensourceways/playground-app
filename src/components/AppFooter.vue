<script setup>
import gaussLogo from "@/assets/logo/gauss-logo.png";
import moocLogo from "@/assets/logo/moocstudio-logo-footer.png";

const linkList = [
  {
    id: "brand",
    text: "品牌",
    url: "https://opengauss.org/zh/trademark.html",
  },
  {
    id: "privacy",
    text: "隐私政策",
    url: "https://opengauss.org/zh/privacyPolicy.html",
  },
  {
    id: "law",
    text: "法律声明",
    url: "https://opengauss.org/zh/legal.html",
  },
];

const labels = {
  atom: "",
  contact: "contact@opengauss.org",
  copyright: "版权所有 © 2022 openGauss 保留一切权利",
};

function handleHrefClick(url) {
  window.open(url);
}
</script>

<template>
  <div class="footer">
    <div class="footer-label">
      <img :src="gaussLogo" alt="" class="gauss-logo" />
      <p class="contact">{{ labels.contact }}</p>
      <p class="copyright">{{ labels.copyright }}</p>
    </div>
    <div class="footer-content">
      <img :src="moocLogo" alt="" class="logo" />
      <div class="link">
        <a
          v-for="item in linkList"
          :key="item.id"
          class="link-item"
          @click="handleHrefClick(item.url)"
          >{{ item.text }}</a
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1488px;
  margin: 0 auto;
  padding: 58px 36px;
  @media screen and (max-width: 1023px) {
    flex-direction: column;
    justify-content: center;
  }
  .footer-label {
    @media screen and (max-width: 1023px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gauss-logo {
      height: 48px;
      vertical-align: top;
    }

    &-desc {
      margin-top: 19px;
      font-size: 12px;
      line-height: 16px;
      font-weight: normal;
      color: var(--gauss-text-color-light);
      text-align: center;
    }

    .contact {
      margin-top: 16px;
      height: 16px;
      font-size: 16px;
      color: var(--gauss-text-color-light);
      line-height: 16px;
    }

    .copyright {
      margin-top: 16px;
      height: 16px;
      font-size: 12px;
      font-weight: 300;
      color: var(--gauss-text-color-light);
      line-height: 16px;
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: 1023px) {
      margin-top: 50px;
    }
    .logo {
      height: 25px;
      vertical-align: 100%;
    }

    .link {
      margin-top: 16px;
      font-size: 14px;
      font-weight: 400;
      color: var(--gauss-text-color-light);
      line-height: 16px;
      .link-item {
        position: relative;
        display: inline-block;
        color: var(--gauss-text-color-light);
        cursor: pointer;

        & + .link-item {
          margin-left: 25px;
          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: -12px;
            width: 1px;
            height: 16px;
            background-color: var(--gauss-color-white);
          }
        }
      }
    }
  }
}
</style>
