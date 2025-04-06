<template>
    <el-container class="default-layout">
      <!-- 左侧侧边栏 -->
      <SideBar />
  
      <!-- 右侧内容区域 -->
      <el-container>
        <el-main class="main-content">
          <router-view /> <!-- 根据路由切换内容 -->
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script setup>
  import { onMounted, provide } from "vue";
  import SideBar from "./sidebar/SideBar.vue";
  import useKnowledgeStore from "@/hooks/useKnowledgeStore";

  const { knowledgeBases, loadKnowledgeBases } = useKnowledgeStore();
  onMounted(async () => {
    await loadKnowledgeBases(); // 加载知识库列表
  })

  // 提供知识库数据给子组件
  provide("knowledgeBases", knowledgeBases);
  provide("loadKnowledgeBases", loadKnowledgeBases);
  </script>
  
  <style lang="scss" scoped>
  .default-layout {
    height: 100vh;
    .sidebar {
      background-color: #fafafa; // 左侧背景色
      // color: #fff;
  
      .logo {
        padding: 20px;
        font-size: 20px;
        text-align: center;
        color: #4caf50; // 主题色
      }
  
      .el-menu {
        border-right: none;
  
        .el-menu-item {
          &:hover {
            background-color: #4caf50; // 主题色
            color: #fff;
          }
  
          &.is-active {
            background-color: #4caf50; // 激活项背景色
            color: #fff;
          }
        }
      }
    }
  
    .el-container {
      width: calc(100% - 240px);
      position: absolute;
      right: 0px;
    }
    .main-content {
      padding: 0px;
      background-color: #ffffff;
      overflow-y: auto;
    }
  }
  </style>
  