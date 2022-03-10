<script setup>
const emit = defineEmits(["prev-click", "next-click"]);

function handlePrevClick(e) {
  emit("prev-click", e);
}

function handleNextClick(e) {
  emit("next-click", e);
}
</script>

<template>
  <div class="chapter-step">
    <div class="prev" @click="handlePrevClick">
      <div class="arrow"></div>
    </div>
    <div class="next" @click="handleNextClick">
      <div class="arrow"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.prev,
.next {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid #000000;

  .arrow {
    width: 10px;
    height: 10px;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }
}

.prev {
  .arrow {
    transform: rotate(-45deg);
  }
}

.next {
  margin-left: 20px;
  .arrow {
    transform: rotate(135deg);
  }
}
</style>
