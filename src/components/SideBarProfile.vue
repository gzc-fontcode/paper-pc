<template>
    <div class="sidebar-profile">
        <div class="profile-hover">
            <div class="profile-img">
                <img src="@/assets/pic/logo-app.png" alt="" />
            </div>
            <div class="hover-card">
                <el-card style="max-width: 480px" class="hover-card-item">
                    <template #header>
                        <div class="card-header">
                            <img class="sidebar-logo" src="@/assets/pic/logo-app.png" alt="" />
                            <span class="sidebar-title">{{ userId }}</span>
                        </div>
                    </template>
                    <!--  -->
                    <div class="card-content">
                        <el-button key="plain" type="" text @click="openPersonalSpaceDrawer">
                            <el-icon><User /></el-icon>
                            <span>个人空间</span>
                        </el-button>
                        <el-button key="plain" type="" text>
                            <el-icon><Setting /></el-icon>
                            <span>设置</span>
                        </el-button>
                    </div>
                    <template #footer>
                        <el-button key="plain" type="" text @click="logout">
                            <el-icon><User /></el-icon>
                            <span>退出登录</span>
                        </el-button>
                    </template>
                </el-card>
            </div>
        </div>
        <el-drawer
            v-model="personalSpaceDrawerVisible"
            title="个人空间"
            :before-close="handleDrawerClose"
            direction="rtl"
            size="30%"
        >
            <!-- 个人空间内容 -->
            <PersonalSpace />
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElDrawer, ElMessage } from 'element-plus'
import PersonalSpace from './PersonalSpace.vue' // 假设 PersonalSpace.vue 在 views 目录下
import { logout as userLogout } from '@/api/user' // 新增接口引入

const userId = localStorage.getItem('userId')

const router = useRouter()
const personalSpaceDrawerVisible = ref(false)

const openPersonalSpaceDrawer = () => {
    personalSpaceDrawerVisible.value = true
}

const logout = async () => {
    try {
        // 调用退出登录接口
        // await userLogout();

        // 清除本地存储中的用户信息
        localStorage.removeItem('token')
        // 如果需要可以同时清除其他用户信息
        // localStorage.removeItem('user');

        ElMessage.success('退出成功')
        // 路由跳转至登录页
        router.push('/login')
    } catch (error) {
        ElMessage.error('退出登录失败')
        console.error('退出登录失败', error)
    }
}
const handleDrawerClose = () => {
    // 可以在这里添加关闭抽屉时的逻辑
    personalSpaceDrawerVisible.value = false
}
</script>

<style lang="scss" scoped>
.sidebar-profile {
    width: 35px;
    height: 35px;
    position: absolute;
    right: 10px;
    .profile-hover {
        display: inline-block;
        position: relative; /* 关键：相对定位 */
        .profile-img {
            cursor: pointer;
            width: 35px;
            height: 35px;
            border-radius: 20%;
            transition: background-color 0.3s;
            &:hover {
                background-color: #eff0f0;
            }
            img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%); /* 关键：居中 */
            }
        }

        .hover-card {
            position: absolute; /* 关键：绝对定位 */
            top: 40px; /* 弹出框的位置 */
            left: -10px;
            // transform: translateX(-50%);
            padding: 8px 12px;
            white-space: nowrap;
            // background-color: black;
            opacity: 0; /* 默认隐藏 */
            pointer-events: none; /* 禁止鼠标事件 */
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1; /* 确保在其他元素之上 */
        }

        &:hover {
            .hover-card {
                opacity: 1; /* 鼠标悬停时显示 */
                pointer-events: auto; /* 启用鼠标事件 */
                transform: translateY(-10px); /* 向上弹出 */
            }
        }
    }
}
.hover-card-item {
    width: 200px;
    :deep(.el-card__header) {
        padding: 10px !important;
    }
    :deep(.el-card__body) {
        padding: 5px !important;
    }
    :deep(.el-card__footer) {
        padding: 5px !important;
    }
    .card-header {
        display: flex;
        align-items: center;
        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            // vertical-align: middle;
        }
        // line-height: 1;
        span {
            // vertical-align: middle;
            display: inline-block;
            margin: 10px;
        }
    }
    .card-content,
    .el-card__footer {
        .el-button {
            display: flex;
            justify-content: flex-start;
            width: 100%;
            & + .el-button {
                margin: 0;
            }
        }
    }
}
:deep(.el-drawer) {
    min-width: 400px;
    // background-image: linear-gradient(45deg, rgba(0, 123, 255, 0.5), rgba(255, 0, 150, 0.5));
    background-image: linear-gradient(45deg, rgba(0, 123, 255, 0.5), rgba(74, 146, 69, 0.5));
    .el-drawer__body {
        overflow-x: hidden;
        overflow-y: scroll;
        /* 自定义滑块样式 */
        &::-webkit-scrollbar {
            width: 3px; /* 滑块宽度 */
        }
        &::-webkit-scrollbar-track {
            background-color: rgb(157, 198, 179); /* 滑块轨道背景色 */
        }
        &::-webkit-scrollbar-thumb {
            background-color: #888; /* 滑块颜色 */
            border-radius: 4px; /* 滑块圆角 */
        }
        &::-webkit-scrollbar-thumb:hover {
            background-color: #555; /* 滑块悬停颜色 */
        }
    }
}
</style>
