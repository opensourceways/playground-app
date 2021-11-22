import { ref } from "vue";
import { isLogined, showLogin } from "@/shared/login";

// 是否开始体验的标志位
export const isBegin = ref(false);

export function beginToTry() {
  if (!isLogined()) {
    showLogin();
  } else {
    isBegin.value = true;
  }
}
