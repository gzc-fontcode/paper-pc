<template>
    <el-aside width="240px" class="sidebar">
        <!-- 顶部 Logo 和标题 -->
        <div class="sidebar-header">
            <img class="sidebar-logo" src="@/assets/pic/logo-app.png" alt="" />
            <span class="sidebar-title">test</span>
            <!-- 头像 -->
            <SideBarProfile />
        </div>

        <!-- 搜索栏 -->
        <el-input
            placeholder="搜索"
            class="sidebar-search"
            prefix-icon="el-icon-search"
            clearable
        />
        <!-- 菜单 -->
        <el-menu :default-active="activeMenu" router>
            <!-- 动态生成菜单项路径 -->
            <el-menu-item :index="`/team/${teamId}/knowledge-base`">知识库</el-menu-item>
            <el-menu-item :index="`/team/${teamId}/member-management`">成员管理</el-menu-item>
            <el-menu-item :index="`/team/${teamId}/workflow`">工作流</el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SideBarProfile from '@/components/SideBarProfile.vue'
import SideBarMenu from '@/components/SideBarMenu.vue'

const route = useRoute()
const teamId = ref('')
const activeMenu = ref('')

onMounted(() => {
  // 从路由参数中获取 teamId
  teamId.value = route.params.teamId
  // 设置默认激活菜单项
  activeMenu.value = `/team/${teamId.value}/knowledge-base`
})
</script>

<style lang="scss" scoped>
.el-aside {
    overflow: visible;
}
.sidebar {
    // background-color: #fff;
    height: 100vh;
    // display: flex;
    flex-direction: column;
    border-right: 1px solid #e4e7ed;
    position: fixed;
    z-index: 101;

    .sidebar-header {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e4e7ed;
        position: relative;
        .sidebar-logo {
            width: 30px;
            height: 30px;
        }

        .sidebar-title {
            font-size: 18px;
            font-weight: bold;
            margin-left: 10px;
        }
    }

    .sidebar-search {
        padding: 15px;
        input {
            border-radius: 20px;
        }
    }

    .sidebar-footer {
        padding: 15px;
        border-top: 1px solid #e4e7ed;

        .footer-menu {
            .el-menu-item {
                display: flex;
                align-items: center;
                padding: 0 10px;
                height: 40px;

                i {
                    font-size: 16px;
                }

                span {
                    margin-left: 10px;
                    font-size: 13px;
                }
            }
        }
    }
}
</style>
