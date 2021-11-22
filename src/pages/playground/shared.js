import { isLogined, showLogin } from "@/shared/login";
import mitt from "@/shared/mitt";

export const PLAY_KEYS = {
  STAERT: "start-to-try",
};

export function beginToTry() {
  if (!isLogined()) {
    showLogin();
  } else {
    mitt.emit(PLAY_KEYS.STAERT);
  }
}
