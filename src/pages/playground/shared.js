import { ref } from "vue";

export const isBegin = ref(true);

export function beginToTry() {
  isBegin.value = true;
}
