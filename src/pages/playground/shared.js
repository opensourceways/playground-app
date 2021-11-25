import { isLogined, showLogin } from "@/shared/login";
import mitt from "@/shared/mitt";

export const PLAYGROUND_KEYS = {
  STAERT: "start-to-try",
  ENTER: "enter-terminal",
};

export function beginToTry() {
  if (!isLogined()) {
    showLogin();
  } else {
    mitt.emit(PLAYGROUND_KEYS.STAERT);
  }
}

export function enterCommond(cmd) {
  mitt.emit(PLAYGROUND_KEYS.ENTER, { commond: cmd });
}
