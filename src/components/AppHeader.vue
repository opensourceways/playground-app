<script setup></script>

<template>
  <div class="oe-header">
    <div class="header-wrap">
      <div class="header-logo">
        <img src="@/assets/openeuler-logo.png" alt="" srcset="" />
        <span class="label">playground</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.oe-header {
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(178, 178, 178, 0.5);
}
.header-wrap {
  width: 1440px;
  margin: 0 auto;
  padding: 12px;
  display: flex;
  align-items: center;
  height: 100%;
}
.header-logo {
  height: 100%;
  display: flex;
  align-items: center;
  img {
    vertical-align: top;
    height: 100%;
  }
  .label {
    margin-left: 8px;
  }
}
</style>
