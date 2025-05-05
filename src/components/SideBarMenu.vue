<template>
    <el-menu
        :default-active="activeMenuStore.activeMenu"
        class="sidebar-menu"
        router
        @select="handleMenuSelect"
    >
        <!-- 折叠子菜单 -->
        <el-menu-item index="dashboard">
            <template #title>
                <div class="expand-icon" @click.stop="switchExpand(0)">
                    <el-icon v-if="expandStore.isExpand[0]"><CaretBottom /></el-icon>
                    <el-icon v-else><CaretRight /></el-icon>
                </div>
                <span>个人知识库</span>
            </template>
        </el-menu-item>
        <!-- 动态显示子菜单 -->
        <!-- 动态显示子菜单 -->
        <div v-if="expandStore.isExpand[0]" class="submenu">
            <el-menu-item v-for="kb in knowledgeBases" :key="kb.id">
                <a :href="`/knowledge-base/${kb.id}`" target="_blank">
                    <img src="@/assets/icon/book-solid.svg" alt="" />
                    <span>{{ kb.name }}</span>
                </a>
            </el-menu-item>
        </div>
        <!-- 分组菜单 -->
        <el-menu-item index="team">
            <template #title>
                <div class="expand-icon" @click.stop="switchExpand(1)">
                    <el-icon v-if="expandStore.isExpand[1]"><CaretBottom /></el-icon>
                    <el-icon v-else><CaretRight /></el-icon>
                </div>
                <span>团队</span>
            </template>
        </el-menu-item>
        <!-- 动态显示子菜单 -->
        <div v-if="expandStore.isExpand[1]" class="submenu">
            <el-menu-item v-for="team in teamList" :key="team.id">
                <a :href="`team/${team.id}/knowledge-base`" target="_blank">
                    <img src="@/assets/icon/team-fill.svg" alt="" />
                    <span>{{ team.name }}</span>
                </a>
            </el-menu-item>
        </div>
        <!-- 菜单项 -->
        <el-menu-item index="favorites">
            <template #title>
                <span>收藏</span>
            </template>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useExpandStore } from '@/stores/home-page/expandStore.js'
import { useActiveMenuStore } from '@/stores/home-page/activeMenuStore.js'
import { getKnowledgeBaseList } from '@/api/storage' // 新增接口引入

// 注入知识库列表
const knowledgeBases = inject('knowledgeBases', [])

// 注入团队列表
const teamList = inject('teamList', [])

const activeMenuStore = useActiveMenuStore()
function handleMenuSelect(menuIndex) {
    activeMenuStore.setActiveMenu(menuIndex) // 更新 Pinia 状态
}

const expandStore = useExpandStore()
function switchExpand(index) {
    expandStore.setExpand(index)
}
</script>

<style lang="scss" scoped>
.sidebar-menu {
    flex: 1;
    padding: 0 15px;
    background-color: #fafafa;

    .el-menu-item {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 50px;

        .expand-icon {
            height: 25px;
            width: 25px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover {
                background-color: #d8dad9;
            }

            .el-icon {
                margin: 0;
            }
        }

        span {
            margin-left: 10px;
            font-size: 14px;
        }
    }

    .submenu {
        padding-left: 30px; // 缩进
        .el-menu-item {
            padding-left: 15px; // 子菜单项缩进
            height: 40px;
            a {
                display: flex;
                align-items: center;
                text-decoration: none;
                color: #262626;
                font-weight: 100;
                &:checked {
                    color: #262626;
                }
                img {
                    width: 1.5em;
                    height: 1.5em;
                    margin-right: -5px;
                }
            }
        }
    }

    .el-sub-menu {
        .el-sub-menu__title {
            i {
                font-size: 18px;
            }

            span {
                margin-left: 10px;
                font-size: 14px;
            }
        }
    }
}
</style>
