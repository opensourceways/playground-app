<script setup></script>

<template>
  <div class="terminal-mask">
    <!-- <div class="mask-header">
      <div class="btn-plus">
        <svg-icon name="plus"></svg-icon>
      </div>
      <div class="btn-maximize">
        <svg-icon name="maximize"></svg-icon>
      </div>
    </div> -->
    <div class="mask-body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.terminal-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #141414;
  color: #eee;

  .mask-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #383737;
    height: 42px;

    .btn-plus {
      line-height: 42px;
      font-size: 24px;
      margin: 0 8px;
      width: 32px;
      height: 32px;
      color: #bbb;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-maximize {
      font-size: 20px;
      padding: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 8px;
    }
  }

  .mask-body {
    // height: calc(100% - 42px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
