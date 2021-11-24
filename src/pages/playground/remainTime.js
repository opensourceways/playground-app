import { queryCrdResouse } from "@/service/api";
import { getUserAuth } from "@/shared/login";
import mitt from "@/shared/mitt";
import { reactive } from "vue";

export const EVENT_TIMEOUT = "reamintime-timeout";

export const remainTime = reactive({
  hour: "00",
  minute: "00",
  second: "00",
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
}

export async function refreshRemainTime(resId) {
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

export function updateRemainTime(sec) {
  if (typeof sec !== undefined) {
    seconds = sec;
  }
  if (handler) {
    clearTime();
  }
  handler = setInterval(() => {
    seconds -= 1;
    if (seconds > 0) {
      handleTime(seconds);
    } else {
      mitt.emit(EVENT_TIMEOUT);
    }
  }, 1000);
}
