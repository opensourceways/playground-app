<template>
  <div class="loading-gear">
    <div class="loading-wrap">
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div class="inner"></div>
      </div>
    </div>
  </div>
</template>
<style>
@keyframes loading-gear {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(22.5deg);
  }
  100% {
    transform: rotate(45deg);
  }
}
.loading-gear {
  width: 1em;
  height: 1em;
  display: inline-block;
  overflow: hidden;
}
.loading-wrap > div {
  transform-origin: 0.5em 0.5em;
  animation: loading-gear 0.2s infinite linear;
}
.loading-wrap > div div {
  position: absolute;
  width: 0.11em;
  height: 0.76em;
  background: currentColor;
  left: 0.5em;
  top: 0.5em;
  transform: translate(-50%, -50%);
}
.loading-wrap > div div:nth-child(1) {
  width: 0.6em;
  height: 0.6em;
  border-radius: 50%;
}
.loading-wrap > div div.inner {
  width: 0.4em;
  height: 0.4em;
  background: #fff;
  border-radius: 50%;
}
.loading-wrap > div div:nth-child(3) {
  transform: translate(-50%, -50%) rotate(45deg);
}
.loading-wrap > div div:nth-child(4) {
  transform: translate(-50%, -50%) rotate(90deg);
}
.loading-wrap > div div:nth-child(5) {
  transform: translate(-50%, -50%) rotate(135deg);
}

.loading-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0;
}
.loading-wrap div {
  box-sizing: content-box;
}
</style>
