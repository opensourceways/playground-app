import { ref } from "vue";

export const footerVisible = ref(false);

export function setFooterVisible(val) {
  footerVisible.value = val;
}
