<script setup>
import { computed, reactive } from "vue";

const btnLabel = "LEST'S PLAY";

const emits = defineEmits(["btn-click"]);

function btnClick() {
  emits("btn-click");
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
const posPersion1 = reactive([0, 0]);
const posPersion2 = reactive([0, 0]);
const posPersion3 = reactive([0, 0]);
const posPersion4 = reactive([0, 0]);
const posCarton = reactive([0, 0]);
const posUfo = reactive([0, 0]);
const posPlanet = reactive([0, 0]);
const posBtn = reactive([0, 0]);

const s1 = computed(() => {
  return `translate3d(${posPersion1[0]}px, ${posPersion1[1]}px, 0px)`;
});
const s2 = computed(() => {
  return `translate3d(${posPersion2[0]}px, ${posPersion2[1]}px, 0px)`;
});
const s3 = computed(() => {
  return `translate3d(${posPersion3[0]}px, ${posPersion3[1]}px, 0px)`;
});
const s4 = computed(() => {
  return `translate3d(${posPersion4[0]}px, ${posPersion4[1]}px, 0px)`;
});
const s5 = computed(() => {
  return `translate3d(${posCarton[0]}px, ${posCarton[1]}px, 0px)`;
});
const s6 = computed(() => {
  return `translate3d(${posUfo[0]}px, ${posUfo[1]}px, 0px)`;
});
const s7 = computed(() => {
  return `translate3d(${posPlanet[0]}px, ${posPlanet[1]}px, 0px)`;
});
const s8 = computed(() => {
  return `translate3d(${posBtn[0]}px, ${posBtn[1]}px, 0px)`;
});

function play() {
  posPersion1[0] = random(-5, 5);
  posPersion1[1] = random(-5, 5);

  posPersion2[0] = random(-5, 5);
  posPersion2[1] = random(-5, 5);

  posPersion3[0] = random(-5, 5);
  posPersion3[1] = random(-5, 5);

  posPersion4[0] = random(-5, 5);
  posPersion4[1] = random(-5, 5);

  posCarton[0] = random(-2, 2);
  posCarton[1] = random(-2, 2);

  posUfo[0] = random(-5, 5);
  posUfo[1] = random(-5, 5);

  posPlanet[0] = random(-5, 5);
  posPlanet[1] = random(-5, 5);

  posBtn[0] = random(-2, 2);
  posBtn[1] = random(-2, 2);
}

play();

setInterval(() => {
  play();
}, 1000);
</script>

<template>
  <div class="terminal-poster">
    <div class="item persion1" :style="{ transform: s1 }"></div>
    <div class="item persion2" :style="{ transform: s2 }"></div>
    <div class="item persion3" :style="{ transform: s3 }"></div>
    <div class="item persion4" :style="{ transform: s4 }"></div>
    <div class="item carton" :style="{ transform: s5 }"></div>
    <div class="item ufo" :style="{ transform: s6 }"></div>
    <div class="item planet" :style="{ transform: s7 }"></div>
    <div class="item button" :style="{ transform: s8 }" @click="btnClick">
      {{ btnLabel }}
    </div>
    <div class="item star l l1"></div>
    <div class="item star m m1"></div>
    <div class="item star m m2"></div>
    <div class="item star m m3"></div>
    <div class="item star n n1"></div>
    <div class="item star n n2"></div>
    <div class="item star n n3"></div>
    <div class="item star n n4"></div>
    <div class="item star n n5"></div>
    <div class="item star s s1"></div>
    <div class="item star s s2"></div>
    <div class="item star s s3"></div>
  </div>
</template>

<style lang="scss">
@keyframes star-bling {
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
}
.terminal-poster {
  background: url(@/assets/terminal-poster/bg.png) no-repeat;
  background-size: cover;
  @media screen and (max-width: 1365px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .item {
    position: absolute;
    transition: transform 2s linear;
    background-repeat: no-repeat;
    @media screen and (max-width: 1365px) {
      display: none;
    }
  }
  .persion1 {
    top: 60.37%;
    left: 52.58%;
    background-position: -201px -69px;
    width: 115px;
    height: 137px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .persion2 {
    top: 35.21%;
    left: 65.67%;
    background-position: 0px 0px;
    width: 86px;
    height: 278px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .persion3 {
    top: 58.54%;
    left: 40.83%;
    background-position: -316px -69px;
    width: 104px;
    height: 118px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .persion4 {
    top: 54.42%;
    left: 28.08%;
    background-position: -86px 0px;
    width: 115px;
    height: 181px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .ufo {
    top: 27.9%;
    left: 48.5%;
    background-position: -86px -181px;
    width: 85px;
    height: 30px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .carton {
    top: 71.04%;
    left: 52%;
    background-position: -201px -206px;
    width: 129px;
    height: 68px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .planet {
    top: 35.06%;
    left: 26.42%;
    background-position: -330px -206px;
    width: 114px;
    height: 52px;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
  }
  .button {
    top: 39.63%;
    left: 39.25%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 28px;
    cursor: pointer;
    background-image: url(@/assets/terminal-poster/image-sprites.png);
    background-position: -201px 0px;
    width: 280px;
    height: 69px;
    @media screen and (max-width: 1365px) {
      display: flex;
      width: auto;
      height: auto;
      left: 50%;
      padding: 16px 24px;
      background: #0032b4;
      white-space: nowrap;
      position: static;
      border-radius: 4px;
    }
  }
  .star {
    width: 128px;
    height: 117px;
    background-image: url(@/assets/terminal-poster/star.png);
    background-size: contain;
    animation: star-bling 3s infinite reverse;
    &.l {
      width: 56px;
      height: 52px;
    }
    &.m {
      width: 36px;
      height: 33px;
    }
    &.n {
      width: 24px;
      height: 22px;
    }
    &.s {
      width: 16px;
      height: 15px;
    }
  }
  .l1 {
    top: 23.06%;
    left: 62.8%;
    transform: rotate(10deg);
  }
  .m1 {
    top: 29.8%;
    left: 27.55%;
    transform: rotate(40deg);
    animation-delay: 0.1s;
  }
  .m2 {
    top: 27.8%;
    left: 67%;
    transform: rotate(70deg);
    animation-delay: 0.5s;
  }
  .m3 {
    top: 55.8%;
    left: 63.55%;
    transform: rotate(20deg);
    animation-delay: 0.8s;
  }
  .n1 {
    top: 27.56%;
    left: 30.52%;
    transform: rotate(30deg);
    animation-delay: 1s;
  }
  .n2 {
    top: 50.56%;
    left: 38.52%;
    transform: rotate(170deg);
    animation-delay: 0.2s;
  }
  .n3 {
    top: 35.8%;
    left: 56.52%;
    transform: rotate(120deg);
    animation-delay: 0.8s;
  }
  .n4 {
    top: 51.56%;
    left: 24.52%;
    transform: rotate(160deg);
    animation-delay: 0.6s;
  }
  .n5 {
    top: 47.56%;
    left: 73.52%;
    transform: rotate(140deg);
    animation-delay: 0.4s;
  }
  .s1 {
    top: 52.8%;
    left: 27.42%;
    transform: rotate(80deg);
    animation-delay: 1.2s;
  }
  .s2 {
    top: 62.8%;
    left: 22.42%;
    transform: rotate(135deg);
    animation-delay: 1.8s;
  }
  .s3 {
    top: 65%;
    left: 76%;
    transform: rotate(30deg);
    animation-delay: 0.7s;
  }
}
</style>
