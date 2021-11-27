<template>
  <div class="loading-arc">
    <div class="loading-arc-wrap">
      <div></div>
      <div><div></div></div>
    </div>
  </div>
</template>
<style type="text/css">
@keyframes ani-loading-arc-wrap {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-arc {
  width: 1em;
  height: 1em;
  display: inline-block;
  overflow: hidden;
  background: #ffffff;
}
.loading-arc-wrap div {
  box-sizing: border-box !important;
}
.loading-arc-wrap > div {
  position: absolute;
  width: 0.72em;
  height: 0.72em;
  top: 0.14em;
  left: 0.14em;
  border-radius: 50%;
  border: 0.08em solid #000;
  border-color: currentColor transparent currentColor transparent;
  animation: ani-loading-arc-wrap 1s linear infinite;
}
.loading-arc-wrap > div:nth-child(2) {
  border-color: transparent;
}
.loading-arc-wrap > div:nth-child(2) div {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(45deg);
}

.loading-arc-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0;
}
.loading-arc-wrap div {
  box-sizing: content-box;
}
</style>
