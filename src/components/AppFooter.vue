<script setup>
import atomLogo from "@/assets/atom-logo.png";
import moocLogo from "@/assets/mooc-logo-footer.png";

const linkList = [
  { id: "brand", text: "品牌", url: "" },
  { id: "privacy", text: "隐私政策", url: "" },
  { id: "law", text: "法律声明", url: "" },
];

const atomDesc =
  "moocstudio是由开放原子开源基金会（OpenAtom Foundation）孵化及运营的开源项目";

const contact = "contact@openeuler.org";
const copyright = "版权所有 © 2022 moocstudo 保留一切权利";
</script>

<template>
  <div class="footer">
    <div class="atom">
      <img :src="atomLogo" alt="" class="atom-logo" />
      <p class="atom-desc">{{ atomDesc }}</p>
    </div>
    <div class="footer-content">
      <img :src="moocLogo" alt="" class="logo" />
      <div class="link">
        <a
          v-for="item in linkList"
          :key="item.id"
          :link="item.url"
          class="link-item"
          >{{ item.text }}</a
        >
      </div>
      <p class="contact">{{ contact }}</p>
      <p class="copyright">{{ copyright }}</p>
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
  .atom {
    @media screen and (max-width: 1023px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &-logo {
      height: 48px;
      vertical-align: top;
    }

    &-desc {
      margin-top: 19px;
      font-size: 12px;
      line-height: 16px;
      font-weight: normal;
      color: #ffffff;
      text-align: center;
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
      color: #ffffff;
      line-height: 16px;
      .link-item {
        position: relative;
        display: inline-block;
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
            background-color: #ffffff;
          }
        }
      }
    }

    .contact {
      margin-top: 16px;
      height: 16px;
      font-size: 16px;
      color: #ffffff;
      line-height: 16px;
    }

    .copyright {
      margin-top: 16px;
      height: 16px;
      font-size: 12px;
      font-weight: 300;
      color: #ffffff;
      line-height: 16px;
    }
  }
}
</style>
