import { ref } from "vue";

export const isBegin = ref(false);

export function beginToTry() {
  isBegin.value = true;
}
