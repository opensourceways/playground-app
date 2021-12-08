<script setup>
import Loading1 from "@/assets/loading/01.gif";
import Loading2 from "@/assets/loading/02.gif";
import Loading3 from "@/assets/loading/03.gif";
import Loading4 from "@/assets/loading/04.gif";

const LoadingIcons = [Loading1, Loading2, Loading3, Loading4];

const t = Math.floor(Math.random() * 4);

const icon = LoadingIcons[t];
</script>
<template>
  <div class="loading-random">
    <img :src="icon" />
  </div>
</template>
<style lang="scss">
.loading-random {
  width: 1em;
  height: 1em;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  > img {
    height: 100%;
    vertical-align: top;
    line-height: 1;
  }
}
</style>
