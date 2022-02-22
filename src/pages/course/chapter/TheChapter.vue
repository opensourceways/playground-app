<script setup>
// import OButton from "@/components/OButton.vue";
import {
  // useRouter,
  useRoute,
} from "vue-router";
import { courseList } from "@/shared/composition/course";
import { queryChapterDetail } from "@/service/courseAPI";
import { computed, ref } from "vue";

// const router = useRouter();
const route = useRoute();

const chapterList = computed(() => {
  const rlt = courseList.value.find((item) => item._course.name === coursePath);
  return rlt ? rlt.chapters : [];
});

const { coursePath, chapterPath } = route.params;

const stepList = ref([]);
const intro = ref("");
const finish = ref("");

queryChapterDetail(coursePath, chapterPath).then((data) => {
  console.log(data);
  stepList.value = data.details.steps;
  intro.value = data.details.intro.html;
  finish.value = data.details.finish.html;
});
</script>
<template>
  <div class="sec-head">
    <div class="chapter-list">
      <div
        v-for="item in chapterList"
        :key="item.chapter_id"
        class="chapter-item"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
  <div class="sec-body">
    <div class="sec-step intro">{{ intro }}</div>
    <div class="sec-step steps">
      <div class="step-list">
        <div v-for="item in stepList" :key="item" class="step-item">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="item.html"></div>
        </div>
      </div>
    </div>
    <div class="sec-step finish">{{ finish }}</div>
  </div>
</template>
<style lang="scss" scoped>
.sec-head {
  .img {
    width: 100%;
    vertical-align: top;
  }
}

.sec-step {
  margin: 12px;
}
</style>
