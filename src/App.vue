<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style lang="scss">

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.el-icon {
  position: static;
}

.dialog-footer {
  button + button {
    margin-left: 10px !important;
  }
}
</style>
