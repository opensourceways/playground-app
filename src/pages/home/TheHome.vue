<script setup>
import banner1 from "@/assets/banner/banner1.png";
import { queryCourseList } from "@/service/courseAPI";

queryCourseList().then((data) => {
  console.log(data.courses);
});
</script>
<template>
  <div class="sec-head">
    <img :src="banner1" class="img" />
  </div>
</template>
<style lang="scss" scoped>
.sec-head {
  .img {
    width: 100%;
    vertical-align: top;
  }
}
</style>
