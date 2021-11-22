<script setup>
import "xterm/css/xterm.css";
import { ref, onMounted } from "vue";
import { Xterm } from "@/plugins/terminal/xterm";
import { WebTTY, protocols } from "@/plugins/terminal/webtty";
import { ConnectionFactory } from "@/plugins/terminal/websocket";

defineProps({
  instance: {
    type: Object,
    default() {
      return null;
    },
  },
});
const terminalEl = ref(null);
let terminal;

function initConnection(term) {
  const url = "ws://7.250.69.147/:8080/ws";
  const gotty_auth_token = "";
  const args = window.location.search;

  const factory = new ConnectionFactory(url, protocols);
  const wt = new WebTTY(term, factory, args, gotty_auth_token);
  const closer = wt.open();

  window.addEventListener("unload", () => {
    closer();
    term.close();
  });
}

onMounted(() => {
  if (!instance) {
    return;
  }
  terminal = new Xterm(terminalEl.value);
  initConnection(terminal);
});

function fit() {
  if (terminal) {
    terminal.fitResize();
  }
}

defineExpose({
  fit,
});
</script>

<template>
  <div class="oe-terminal">
    <div class="remain-time">{{}}</div>
    <div ref="terminalEl" class="terminal-el"></div>
  </div>
</template>

<style lang="scss">
.oe-terminal {
  height: 100%;
  .terminal-el {
    width: 100%;
    height: 100%;
  }
}
</style>
