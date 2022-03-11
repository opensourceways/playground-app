import { isLogined, showLogin } from "@/shared/login";
import mitt from "@/shared/mitt";

export const PLAYGROUND_KEYS = {
  START: "start-to-try",
  ENTER: "enter-terminal",
};

export const PLAYGROUND_PAGES = {
  BACK_TO_HOME: "back-to-home",
  SET_FOOTER: "set-footer",
};

export function beginToTry() {
  if (!isLogined.value) {
    showLogin();
  } else {
    mitt.emit(PLAYGROUND_KEYS.START);
  }
}

export function enterCommond(cmd) {
  mitt.emit(PLAYGROUND_KEYS.ENTER, { commond: cmd });
}
