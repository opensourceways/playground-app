<script setup>
import { queryCrdResouse } from "@/service/api";
import { getUserAuth } from "@/shared/login";
import { reactive } from "vue";

const emit = defineEmits(["timeout"]);

const WARNING_THRESHOLD = 1 * 60; // 告警阈值

const remainTime = reactive({
  hour: "00",
  minute: "00",
  second: "00",
  warning: false,
});

let handler = null;
let seconds = 60 * 10;

function paddLeft(v) {
  return `${v}`.padStart(2, "0");
}

function handleTime(second) {
  const h = Math.floor(second / (60 * 60));
  const m = Math.floor((second - h * (60 * 60)) / 60);
  const s = second % 60;

  remainTime.hour = paddLeft(h);
  remainTime.minute = paddLeft(m);
  remainTime.second = paddLeft(s);

  remainTime.warning = second > 0 && second <= WARNING_THRESHOLD;
}

/**
 * 从后台获取剩余时间
 */
async function refreshTime(resId) {
  const { token } = getUserAuth();
  if (!token) {
    return;
  }
  // 清除之前的定时轮询
  if (handler) {
    clearTime();
  }

  const res = await queryCrdResouse({
    userResId: resId,
    token,
  });

  if (res.code === 200) {
    seconds = res.instanceInfo.remainSecond;
    updateRemainTime(seconds);
  }
}

function clearTime() {
  if (handler) {
    clearInterval(handler);
  }
}

/**
 * 更新显示的剩余时间
 */
function updateTime(sec) {
  if (typeof sec !== undefined) {
    seconds = sec;
  }
  if (handler) {
    clearTime();
  }
  handler = setInterval(() => {
    seconds -= 1;
    if (seconds >= 0) {
      handleTime(seconds);
    } else {
      clearTime();
      emit("timeout");
    }
  }, 1000);
}

function reset() {
  handleTime(0);
  clearTime();
}

defineExpose({
  refreshTime,
  updateTime,
  reset,
});
</script>

<template>
  <div class="remain-time" :class="{ warning: remainTime.warning }">
    <span class="time-item">{{ remainTime.hour }}</span
    >:<span class="time-item">{{ remainTime.minute }}</span
    >:<span class="time-item">{{ remainTime.second }}</span>
  </div>
</template>

<style lang="scss">
.remain-time {
  font-size: 18px;
  color: #002fa7;
  display: flex;
  .time-item {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 32px;
    width: 32px;
    background-color: #fff;
    margin: 0 4px;
    box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);
  }
  &.warning {
    color: red;
  }
}
</style>
