<template>
    <div class="root">
        <!-- 侧边栏 -->
        <Sidebar />
        <!-- 路由视图 -->
        <router-view />
    </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue' // 导入 Sidebar 组件
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    height: 100vh;
    width: 100%;
}
</style>
