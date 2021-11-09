<script setup>
import { ref, onMounted } from "vue";
import { Xterm } from "@/shared/xterm";
import { WebTTY, protocols } from "@/shared/webtty";
import { ConnectionFactory } from "@/shared/websocket";

const terminal = ref(null);

onMounted(() => {
  console.log(terminal.value);
  const term = new Xterm(terminal.value);
});
</script>

<template>
  <div class="oe-terminal">
    <div ref="terminal" class="terminal-el">Terminal</div>
  </div>
</template>

<style lang="scss">
.oe-terminal {
  height: 100%;
  .terminal-el {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
}
</style>
