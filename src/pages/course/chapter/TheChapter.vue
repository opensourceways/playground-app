<script setup>
// import OButton from "@/components/OButton.vue";
import CourseArticle from "@/components/CourseArticle.vue";
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

const intro = ref({});
const stepList = ref([]);
const finish = ref({});

queryChapterDetail(coursePath, chapterPath).then((data) => {
  stepList.value = data.details.steps;
  intro.value = data.details.intro;
  finish.value = data.details.finish;
});

function exec(e) {
  console.log(e.command);
}
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
    <div class="sec-step intro">
      <CourseArticle :content="intro.html" @click="exec"></CourseArticle>
    </div>
    <div class="sec-step steps">
      <div class="step-list">
        <div v-for="item in stepList" :key="item" class="step-item">
          <CourseArticle :content="item.html" @click="exec"></CourseArticle>
        </div>
      </div>
    </div>
    <div class="sec-step finish">
      <CourseArticle :content="finish.html" @click="exec"></CourseArticle>
    </div>
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
<style lang="scss"></style>
