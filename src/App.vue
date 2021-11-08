<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "@/components/AppHeader.vue";

const terminal = ref(null);

onMounted(() => {
  console.log(terminal.value);
});
</script>

<template>
  <app-header></app-header>
  <div class="app-body">
    <div ref="terminal"></div>
  </div>
</template>

<style lang="sass"></style>
